import Content from '../models/content/Content';
import ContentQuery from '../models/content/ContentQuery';
import CreateContentRequest from '../models/content/CreateContentRequest';
import UpdateContentRequest from '../models/content/UpdateContentRequest';
import { Paginator } from '../models/core/Paginator';
import apiService from './ApiService';

class ContentService {
  async findAll(
    courseId: string,
    contentQuery: ContentQuery,
  ): Promise<Paginator<Content>> {
    return (
      await apiService.get<Paginator<Content>>(
        `/api/courses/${courseId}/contents`,
        {
          params: contentQuery,
        },
      )
    ).data;
  }

  async save(courseId: string, createContentRequest: FormData): Promise<void> {
    await apiService.post(
      `/api/courses/${courseId}/contents`,
      createContentRequest,
    );
  }

  async update(
    courseId: string,
    id: string,
    updateContentRequest: FormData,
  ): Promise<void> {
    await apiService.put(
      `/api/courses/${courseId}/contents/${id}`,
      updateContentRequest,
    );
  }

  async delete(courseId: string, id: string): Promise<void> {
    await apiService.delete(`/api/courses/${courseId}/contents/${id}`);
  }
}

export default new ContentService();
