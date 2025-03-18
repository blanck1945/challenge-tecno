import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';

@Module({
  providers: [FavoritesService],
  exports: [FavoritesService],
  controllers: [FavoritesController],
})
export class FavoritesModule {}
