import { Controller, Get, Param } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { Favorite } from './favorites.entity';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get(':userId')
  async getFavorites(@Param('userId') userId: string): Promise<Favorite[]> {
    return this.favoritesService.getFavorites(userId);
  }

  @Get(':userId/:courseId')
  async isFavorite(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ): Promise<boolean> {
    return this.favoritesService.isFavorite(userId, courseId);
  }
}
