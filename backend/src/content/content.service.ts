import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CourseService } from '../course/course.service';
import { UpdateContentDto } from './content.dto';
import { Content } from './content.entity';
import { ContentQuery } from './content.query';
import { UploadService } from 'src/upload/upload.service';
import { handleIlike } from 'src/helpers/handleIlike';
import { handleSort } from 'src/helpers/handleSort';
import { Pagination } from 'src/interfaces/pagination.interface';
import { Order } from 'src/enums/order.enum';

@Injectable()
export class ContentService {
  constructor(
    private readonly courseService: CourseService,
    private readonly uploadService: UploadService,
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
  ) {}

  async save(
    courseId: string,
    createContentDto: any,
    file: any,
  ): Promise<Content> {
    const course = await this.courseService.findById(courseId);

    if (file) {
      createContentDto.image = (
        await this.uploadService.uploadFile(file.buffer)
      ).file;
    }

    const content = this.contentRepository.create({
      name: createContentDto.name,
      description: createContentDto.description,
      image: createContentDto.image,
      course,
    });

    return await this.contentRepository.save(content);
  }

  async findAll(contentQuery: ContentQuery): Promise<Pagination<Content>> {
    const { sortBy, page, limit } = contentQuery;

    const order = handleSort(sortBy, {
      name: Order.ASC,
      description: Order.ASC,
    });
    const where = handleIlike(contentQuery, ['name', 'description']);

    const [contents, total] = await this.contentRepository.findAndCount({
      where,
      order,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      results: contents,
      page,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Content> {
    const content = await this.contentRepository.findOne(id);

    if (!content) {
      throw new HttpException(
        `Could not find content with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return content;
  }

  async findByCourseIdAndId(courseId: string, id: string): Promise<Content> {
    const content = await this.contentRepository.findOne({
      where: { courseId, id },
    });
    if (!content) {
      throw new HttpException(
        `Could not find content with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return content;
  }

  async findAllByCourseId(
    courseId: string,
    contentQuery: ContentQuery,
  ): Promise<Pagination<Content>> {
    const { sortBy, page, limit, ...rest } = contentQuery;

    const order = handleSort(sortBy, {
      name: Order.ASC,
      description: Order.ASC,
    });

    const where = handleIlike(rest, ['name', 'description']);

    const [contents, total] = await this.contentRepository.findAndCount({
      where: { courseId, ...where, ...rest },
      order,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      results: contents,
      page: +page,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async update(
    courseId: string,
    id: string,
    updateContentDto: UpdateContentDto,
    file: any,
  ): Promise<Content> {
    const content = await this.findByCourseIdAndId(courseId, id);

    if (file) {
      updateContentDto.image = (
        await this.uploadService.uploadFile(file.buffer)
      ).file;
    }

    return await this.contentRepository.save({
      id: content.id,
      ...updateContentDto,
    });
  }

  async delete(courseId: string, id: string): Promise<string> {
    const content = await this.findByCourseIdAndId(courseId, id);

    if (!content) {
      throw new HttpException(
        `Could not find content with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.contentRepository.delete(content);
    return id;
  }

  async count(): Promise<number> {
    return await this.contentRepository.count();
  }
}
