import Review from '../models/review/Review';
import apiService from './ApiService';

class ReviewService {
  async getUserHasReviewedThisCourse(
    courseId: string,
    userId: string,
  ): Promise<Review> {
    return (await apiService.get<Review>(`/api/reviews/${courseId}/${userId}`))
      .data;
  }

  async save(
    courseId: string,
    userId: string,
    rating: number,
    message: string,
  ) {
    return (
      await apiService.post(`/api/reviews/${courseId}/${userId}`, {
        rating,
        message,
      })
    ).data;
  }
}

export default new ReviewService();
