import apiService from './ApiService';

class EnrollService {
  async enroll(userId: string, courseId: string): Promise<void> {
    await apiService.post(`/api/enrollments/${userId}/${courseId}`);
  }

  async reenroll(userId: string, courseId: string): Promise<void> {
    await apiService.post(`/api/enrollments/${userId}/${courseId}/reenroll`);
  }

  async unenroll(userId: string, courseId: string): Promise<void> {
    await apiService.delete(`/api/enrollments/${userId}/${courseId}`);
  }

  async findAllEnrolledCoursesByUserId(userId: string): Promise<string[]> {
    return (await apiService.get<string[]>(`/api/enrollments/${userId}`)).data;
  }
}

export default new EnrollService();
