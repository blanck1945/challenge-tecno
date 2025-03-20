import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Favorite } from './favorites.entity';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let repository: Repository<Favorite>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        {
          provide: getRepositoryToken(Favorite),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
    repository = module.get<Repository<Favorite>>(getRepositoryToken(Favorite));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFavorites', () => {
    it('should return an array of favorites', async () => {
      const mockFavorites = [{ id: '1', user: '1', course: { id: '1' } }];
      mockRepository.find.mockResolvedValue(mockFavorites);

      const result = await service.getFavorites('1');
      expect(result).toEqual(mockFavorites);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { user: '1' },
        relations: ['course'],
      });
    });
  });

  describe('save', () => {
    it('should create a new favorite', async () => {
      const mockFavorite = { id: '1', user: { id: '1' }, course: { id: '1' } };
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockFavorite);
      mockRepository.save.mockResolvedValue(mockFavorite);

      const result = await service.save('1', '1');
      expect(result).toEqual(mockFavorite);
    });

    it('should throw error if favorite already exists', async () => {
      mockRepository.findOne.mockResolvedValue({ id: '1' });

      await expect(service.save('1', '1')).rejects.toThrow(HttpException);
    });
  });

  describe('delete', () => {
    it('should delete a favorite', async () => {
      const mockFavorite = { id: '1', user: '1', course: '1' };
      mockRepository.findOne.mockResolvedValue(mockFavorite);
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.delete('1', '1');
      expect(result).toBe('1');
      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw error if favorite not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.delete('1', '1')).rejects.toThrow(HttpException);
    });
  });

  describe('isFavorite', () => {
    it('should return true if favorite exists', async () => {
      mockRepository.findOne.mockResolvedValue({ id: '1' });

      const result = await service.isFavorite('1', '1');
      expect(result).toBe(true);
    });

    it('should return false if favorite does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.isFavorite('1', '1');
      expect(result).toBe(false);
    });
  });
});
