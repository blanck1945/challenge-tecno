import { Injectable } from '@nestjs/common';
import { Ranking } from './ranking.entity';
import { Course } from 'src/course/course.entity';

@Injectable()
export class RankingService {
  async getRanking() {
    return 'Hello World';
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

  async createRanking(ranking: Ranking) {
    return 'Hello World';
  }
}
