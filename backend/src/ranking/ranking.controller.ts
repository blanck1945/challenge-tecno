import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { Ranking } from './ranking.entity';

@Controller('rankings')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get()
  async getRanking() {
    return this.rankingService.getRanking();
  }

  @Get(':id')
  async getRankingById(@Param('id') id: string) {
    return this.rankingService.getRankingById(id);
  }

  @Post()
  async createRanking(@Body() ranking: Ranking) {
    return this.rankingService.createRanking(ranking);
  }
}
