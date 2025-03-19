import { Module } from '@nestjs/common';
import { RankingService } from './review.service';
import { RankingController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
  providers: [RankingService],
  controllers: [RankingController],
  exports: [RankingService],
})
export class ReviewModule {}
