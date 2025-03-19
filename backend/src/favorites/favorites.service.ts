import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './favorites.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
  ) {}

  async getFavorites(userId: string): Promise<Favorite[]> {
    const favorites = await this.favoriteRepository.find({
      where: { user: userId },
      relations: ['course'],
    });
    return favorites;
  }

  async save(userId: string, courseId: string): Promise<Favorite> {
    const favorite = await this.favoriteRepository.findOne({
      where: { user: userId, course: courseId },
    });

    if (favorite) {
      throw new HttpException(
        'Favorite already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const fav = this.favoriteRepository.create({
      user: { id: userId },
      course: { id: courseId },
    });

    return await this.favoriteRepository.save(fav);
  }

  async delete(userId: string, courseId: string): Promise<string> {
    const favorite = await this.favoriteRepository.findOne({
      where: { user: userId, course: courseId },
    });

    if (!favorite) {
      throw new HttpException('Favorite not found', HttpStatus.NOT_FOUND);
    }

    await this.favoriteRepository.delete(favorite.id);
    return favorite.id;
  }

  async isFavorite(userId: string, courseId: string): Promise<boolean> {
    const favorite = await this.favoriteRepository.findOne({
      where: { user: userId, course: courseId },
    });

    return favorite ? true : false;
  }
}
