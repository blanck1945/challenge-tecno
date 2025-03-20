import Course from '../models/course/Course';
import apiService from './ApiService';

class FavoritesService {
  async getFavorites(userId: string): Promise<any[]> {
    return (await apiService.get<Course[]>(`/api/favorites/${userId}`)).data;
  }

  async isFavorite(userId: string, courseId: string): Promise<boolean> {
    return (
      await apiService.get<boolean>(`/api/favorites/${userId}/${courseId}`)
    ).data;
  }

  async addFavorite(userId: string, courseId: string): Promise<void> {
    await apiService.post(`/api/favorites/${userId}/favorites`, { courseId });
  }

  async removeFavorite(userId: string, courseId: string): Promise<void> {
    await apiService.delete(`/api/favorites/${userId}/favorites/${courseId}`);
  }
}

export default new FavoritesService();
