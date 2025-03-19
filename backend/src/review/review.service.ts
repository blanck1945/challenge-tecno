import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { CreateRankingDto as CreateReviewDto } from './review.dto';
import { Pagination } from 'src/interfaces/pagination.interface';
import { RankingQuery as ReviewQuery } from './review.query';

@Injectable()
export class RankingService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async getRanking(rankingQuery: ReviewQuery): Promise<Pagination<Review>> {
    const { sortBy, page, limit } = rankingQuery;
    const skip = (page - 1) * limit;
    const [rankings, total] = await this.reviewRepository.findAndCount({
      order: { [sortBy]: 'ASC' },
      skip,
      take: limit,
    });

    return {
      results: rankings,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async getUserHasRankThisCourse(courseId: string, userId: string) {
    return await this.reviewRepository.findOne({
      where: { course: courseId, user: userId },
    });
  }

  async getRankingById(id: string): Promise<{ averageScore: number }> {
    const averageScore = await this.reviewRepository
      .createQueryBuilder('ranking')
      .select('AVG(ranking.rating)', 'average')
      .where('ranking.courseId = :id', { id })
      .getRawOne();

    return {
      averageScore: Number(Number(averageScore?.average).toFixed(2)) || 0,
    };
  }

  async createRanking(
    courseId: string,
    userId: string,
    createRankingDto: CreateReviewDto,
  ) {
    try {
      const ranking = this.reviewRepository.create({
        rating: createRankingDto.rating,
        message: createRankingDto.message,
        course: { id: courseId },
        user: { id: userId },
      });
      await this.reviewRepository.save(ranking);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async delete(id: string): Promise<string> {
    const review = await this.reviewRepository.findOne(id);

    if (!review) {
      throw new HttpException(
        `Could not find review with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.reviewRepository.delete(review);
    return id;
  }
}
