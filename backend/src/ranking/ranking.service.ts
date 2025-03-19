import { BadRequestException, Injectable } from '@nestjs/common';
import { Ranking } from './ranking.entity';
import { Course } from 'src/course/course.entity';
import { CreateRankingDto } from './ranking.dto';

@Injectable()
export class RankingService {
  async getRanking() {
    return 'Hello World';
  }

  async getUserHasRankThisCourse(courseId: string, userId: string) {
    return await Ranking.findOne({
      where: { courseId, userId },
    });
  }

  async getRankingById(id: string): Promise<{ averageScore: number }> {
    const averageScore = await Course.createQueryBuilder('course')
      .leftJoin('course.rankings', 'ranking')
      .select('AVG(ranking.score)', 'average')
      .where('course.id = :id', { id })
      .getRawOne();

    return {
      averageScore: Number(Number(averageScore?.average).toFixed(2)) || 0,
    };
  }

  async createRanking(
    courseId: string,
    userId: string,
    createRankingDto: CreateRankingDto,
  ) {
    try {
      const ranking = await Ranking.create({
        courseId,
        userId,
        rating: createRankingDto.rating,
        message: createRankingDto.message,
      });
      await ranking.save();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
