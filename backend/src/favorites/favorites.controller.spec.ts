import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { Favorite } from './favorites.entity';

describe('FavoritesController', () => {
  let controller: FavoritesController;
  let service: FavoritesService;

  const mockFavoritesService = {
    getFavorites: jest.fn(),
    isFavorite: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritesController],
      providers: [
        {
          provide: FavoritesService,
          useValue: mockFavoritesService,
        },
      ],
    }).compile();

    controller = module.get<FavoritesController>(FavoritesController);
    service = module.get<FavoritesService>(FavoritesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFavorites', () => {
    it('should return an array of favorites', async () => {
      const mockFavorite = new Favorite();
      mockFavorite.id = '1';
      const result = [mockFavorite];
      jest.spyOn(service, 'getFavorites').mockResolvedValue(result);

      expect(await controller.getFavorites('1')).toBe(result);
      expect(service.getFavorites).toHaveBeenCalledWith('1');
    });
  });

  describe('isFavorite', () => {
    it('should return true if course is favorite', async () => {
      jest.spyOn(service, 'isFavorite').mockResolvedValue(true);

      expect(await controller.isFavorite('1', '1')).toBe(true);
      expect(service.isFavorite).toHaveBeenCalledWith('1', '1');
    });
  });

  describe('addFavorite', () => {
    it('should add a favorite', async () => {
      const mockFavorite = new Favorite();
      mockFavorite.id = '1';
      jest.spyOn(service, 'save').mockResolvedValue(mockFavorite);

      expect(await controller.addFavorite('1', { courseId: '1' })).toBe(
        mockFavorite,
      );
      expect(service.save).toHaveBeenCalledWith('1', '1');
    });
  });

  describe('removeFavorite', () => {
    it('should remove a favorite', async () => {
      const result = 'Favorite removed successfully';
      jest.spyOn(service, 'delete').mockResolvedValue(result);

      expect(await controller.removeFavorite('1', '1')).toBe(result);
      expect(service.delete).toHaveBeenCalledWith('1', '1');
    });
  });
});
