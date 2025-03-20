import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { Favorite } from './favorites.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@Controller('favorites')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@ApiTags('Favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get(':userId')
  @Roles(Role.User)
  async getFavorites(@Param('userId') userId: string): Promise<Favorite[]> {
    return this.favoritesService.getFavorites(userId);
  }

  @Get(':userId/:courseId')
  @Roles(Role.User)
  async isFavorite(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ): Promise<boolean> {
    return this.favoritesService.isFavorite(userId, courseId);
  }

  @Post(':id/favorites')
  @Roles(Role.User)
  async addFavorite(
    @Param('id') userId: string,
    @Body() body: { courseId: string },
  ): Promise<Favorite> {
    return this.favoritesService.save(userId, body.courseId);
  }

  @Delete(':id/favorites/:courseId')
  @Roles(Role.User)
  async removeFavorite(
    @Param('id') userId: string,
    @Param('courseId') courseId: string,
  ): Promise<string> {
    return this.favoritesService.delete(userId, courseId);
  }
}
