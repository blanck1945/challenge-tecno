import { Injectable } from '@nestjs/common';
import { Favorite } from './favorites.entity';
import { Course } from 'src/course/course.entity';

@Injectable()
export class FavoritesService {
  async getFavorites(userId: string): Promise<Favorite[]> {
    const favorites = await Favorite.find({
      where: { userId },
      relations: ['course'],
    });
    console.log('FAVORITES', favorites);
    return favorites;
  }

  async addFavorite(userId: string, courseId: string): Promise<void> {
    console.log(userId, courseId);
    const favorite = await Favorite.findOne({
      where: { userId, courseId },
    });

    if (favorite) {
      throw new Error('Favorite already exists');
    }

    const fav = await Favorite.create({ userId, courseId });
    await fav.save();
  }

  async removeFavorite(userId: string, courseId: string): Promise<void> {
    const favorite = await Favorite.findOne({
      where: { userId, courseId },
    });

    if (!favorite) {
      throw new Error('Favorite not found');
    }

    await favorite.remove();
  }

  async isFavorite(userId: string, courseId: string): Promise<boolean> {
    const favorite = await Favorite.findOne({
      where: { userId, courseId },
    });
    return favorite ? true : false;
  }
}
