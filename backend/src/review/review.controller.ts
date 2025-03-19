import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RankingService } from './review.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateRankingDto } from './review.dto';
import { RankingQuery } from './review.query';

@Controller('reviews')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@ApiTags('Reviews')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get()
  @Roles(Role.Admin)
  async getReview(@Query() rankingQuery: RankingQuery) {
    return this.rankingService.getRanking(rankingQuery);
  }

  @Get(':id')
  @Roles(Role.User)
  async getReviewById(@Param('id') id: string) {
    return this.rankingService.getRankingById(id);
  }

  @Get(':courseId/:userId')
  @Roles(Role.User)
  async getUserHasReviewedThisCourse(
    @Param('courseId') courseId: string,
    @Param('userId') userId: string,
  ) {
    return this.rankingService.getUserHasRankThisCourse(courseId, userId);
  }

  @Post(':courseId/:userId')
  @Roles(Role.User)
  async createReview(
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

  @Delete(':id')
  @Roles(Role.User, Role.Editor, Role.Admin)
  async deleteReview(@Param('id') id: string) {
    return this.rankingService.delete(id);
  }
}
