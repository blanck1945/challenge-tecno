import { Test, TestingModule } from '@nestjs/testing';
import { RankingController } from './review.controller';
import { RankingService } from './review.service';
import { CreateRankingDto } from './review.dto';
import { Review } from './review.entity';
import { Pagination } from 'src/interfaces/pagination.interface';

describe('RankingController', () => {
  let controller: RankingController;
  let service: RankingService;

  const mockRankingService = {
    getRanking: jest.fn(),
    getRankingById: jest.fn(),
    getUserHasRankThisCourse: jest.fn(),
    createRanking: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RankingController],
      providers: [
        {
          provide: RankingService,
          useValue: mockRankingService,
        },
      ],
    }).compile();

    controller = module.get<RankingController>(RankingController);
    service = module.get<RankingService>(RankingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getReview', () => {
    it('should get reviews with pagination and sorting', async () => {
      const mockReview: Partial<Review> = {
        id: '1',
        rating: 5,
        message: '',
        course: null,
        user: null,
      };
      const mockPagination: Pagination<Review> = {
        results: [mockReview as Review],
        total: 1,
        page: 1,
        lastPage: 1,
      };
      jest.spyOn(service, 'getRanking').mockResolvedValue(mockPagination);

      expect(await controller.getReview('rating', 1, 10)).toBe(mockPagination);
      expect(service.getRanking).toHaveBeenCalledWith('rating', 1, 10);
    });
  });

  describe('getReviewById', () => {
    it('should get a review by id', async () => {
      const result = { averageScore: 4.5 };
      jest.spyOn(service, 'getRankingById').mockResolvedValue(result);

      expect(await controller.getReviewById('1')).toBe(result);
      expect(service.getRankingById).toHaveBeenCalledWith('1');
    });
  });

  describe('getUserHasReviewedThisCourse', () => {
    it('should check if user has reviewed a course', async () => {
      const mockReview: Partial<Review> = {
        id: '1',
        rating: 5,
        message: '',
        course: null,
        user: null,
      };
      jest
        .spyOn(service, 'getUserHasRankThisCourse')
        .mockResolvedValue(mockReview as Review);

      expect(
        await controller.getUserHasReviewedThisCourse('course1', 'user1'),
      ).toBe(mockReview);
      expect(service.getUserHasRankThisCourse).toHaveBeenCalledWith(
        'course1',
        'user1',
      );
    });
  });

  describe('createReview', () => {
    it('should create a new review', async () => {
      const createRankingDto: CreateRankingDto = {
        rating: 5,
        message: 'Great course!',
      };
      jest.spyOn(service, 'createRanking').mockResolvedValue(undefined);

      await controller.createReview('course1', 'user1', createRankingDto);
      expect(service.createRanking).toHaveBeenCalledWith(
        'course1',
        'user1',
        createRankingDto,
      );
    });
  });

  describe('deleteReview', () => {
    it('should delete a review', async () => {
      const deletedId = '1';
      jest.spyOn(service, 'delete').mockResolvedValue(deletedId);

      expect(await controller.deleteReview('1')).toBe(deletedId);
      expect(service.delete).toHaveBeenCalledWith('1');
    });
  });
});
