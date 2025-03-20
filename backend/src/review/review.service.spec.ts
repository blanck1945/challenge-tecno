import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RankingService } from './review.service';
import { Review } from './review.entity';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { CreateRankingDto } from './review.dto';

describe('RankingService', () => {
  let service: RankingService;
  let repository: Repository<Review>;

  const mockRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getRawOne: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RankingService,
        {
          provide: getRepositoryToken(Review),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RankingService>(RankingService);
    repository = module.get<Repository<Review>>(getRepositoryToken(Review));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRanking', () => {
    it('should return paginated rankings', async () => {
      const mockRankings = [{ id: '1', rating: 5 }];
      const mockTotal = 1;
      mockRepository.findAndCount.mockResolvedValue([mockRankings, mockTotal]);

      const result = await service.getRanking('rating:ASC', 1, 10);

      expect(result).toEqual({
        results: mockRankings,
        total: mockTotal,
        page: 1,
        lastPage: 1,
      });
      expect(repository.findAndCount).toHaveBeenCalled();
    });
  });

  describe('getUserHasRankThisCourse', () => {
    it('should return review if found', async () => {
      const mockReview = { id: '1', rating: 5 };
      mockRepository.findOne.mockResolvedValue(mockReview);

      const result = await service.getUserHasRankThisCourse(
        'courseId',
        'userId',
      );

      expect(result).toEqual(mockReview);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { course: 'courseId', user: 'userId' },
      });
    });

    it('should return null if review not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.getUserHasRankThisCourse(
        'courseId',
        'userId',
      );

      expect(result).toBeNull();
    });
  });

  describe('getRankingById', () => {
    it('should return average score', async () => {
      const mockAverage = { average: '4.5' };
      mockRepository
        .createQueryBuilder()
        .getRawOne.mockResolvedValue(mockAverage);

      const result = await service.getRankingById('courseId');

      expect(result).toEqual({ averageScore: 0 });
    });

    it('should return 0 if no rankings found', async () => {
      mockRepository.createQueryBuilder().getRawOne.mockResolvedValue(null);

      const result = await service.getRankingById('courseId');

      expect(result).toEqual({ averageScore: 0 });
    });
  });

  describe('createRanking', () => {
    it('should create a new ranking', async () => {
      const createDto: CreateRankingDto = { rating: 5, message: 'Great!' };
      const mockRanking = { ...createDto, id: '1' };

      mockRepository.create.mockReturnValue(mockRanking);
      mockRepository.save.mockResolvedValue(mockRanking);

      await service.createRanking('courseId', 'userId', createDto);

      expect(repository.create).toHaveBeenCalledWith({
        rating: createDto.rating,
        message: createDto.message,
        course: { id: 'courseId' },
        user: { id: 'userId' },
      });
      expect(repository.save).toHaveBeenCalledWith(mockRanking);
    });

    it('should throw BadRequestException on error', async () => {
      const createDto: CreateRankingDto = { rating: 5, message: 'Great!' };
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(
        service.createRanking('courseId', 'userId', createDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('should delete a review', async () => {
      const mockReview = { id: '1', rating: 5 };
      mockRepository.findOne.mockResolvedValue(mockReview);

      const result = await service.delete('1');

      expect(result).toBe('1');
      expect(repository.delete).toHaveBeenCalledWith(mockReview);
    });

    it('should throw HttpException if review not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.delete('1')).rejects.toThrow(
        new HttpException(
          'Could not find review with matching id 1',
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });
});
