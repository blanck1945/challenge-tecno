import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ILike } from 'typeorm';

import { CourseService } from '../course/course.service';
import { CreateContentDto, UpdateContentDto } from './content.dto';
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
  ) {}

  async save(courseId: string, createContentDto: any): Promise<Content> {
    const course = await this.courseService.findById(courseId);

    if (createContentDto.image) {
      createContentDto.image = await this.uploadService.uploadFile(
        createContentDto.image,
      );
    }

    const content = Content.create({
      name: createContentDto.name,
      description: createContentDto.description,
      image: createContentDto.image,
      course,
      dateCreated: new Date(),
    });

    return await content.save();
  }

  async findAll(contentQuery: ContentQuery): Promise<Pagination<Content>> {
    const { sortBy, page, limit } = contentQuery;

    const order = handleSort(sortBy, {
      name: Order.ASC,
      description: Order.ASC,
    });
    const where = handleIlike(contentQuery, ['name', 'description']);

    const [contents, total] = await Content.findAndCount({
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
    const content = await Content.findOne(id);

    if (!content) {
      throw new HttpException(
        `Could not find content with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return content;
  }

  async findByCourseIdAndId(courseId: string, id: string): Promise<Content> {
    const content = await Content.findOne({ where: { courseId, id } });
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

    const [contents, total] = await Content.findAndCount({
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

    return await Content.create({ id: content.id, ...updateContentDto }).save();
  }

  async delete(courseId: string, id: string): Promise<string> {
    const content = await this.findByCourseIdAndId(courseId, id);
    await Content.delete(content);
    return id;
  }

  async count(): Promise<number> {
    return await Content.count();
  }
}
