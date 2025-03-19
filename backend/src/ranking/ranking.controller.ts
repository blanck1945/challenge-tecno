import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { Ranking } from './ranking.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateRankingDto } from './ranking.dto';

@Controller('rankings')
@UseGuards(JwtGuard, RolesGuard)
@ApiTags('Rankings')
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

  @Get(':courseId/:userId')
  async getUserHasRankThisCourse(
    @Param('courseId') courseId: string,
    @Param('userId') userId: string,
  ) {
    return this.rankingService.getUserHasRankThisCourse(courseId, userId);
  }

  @Post(':courseId/:userId')
  @Roles(Role.User)
  async createRanking(
    @Param('courseId') courseId: string,
    @Param('userId') userId: string,
    @Body() createRankingDto: CreateRankingDto,
  ) {
    return this.rankingService.createRanking(
      courseId,
      userId,
      createRankingDto,
    );
  }
}
