import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CourseService } from '../course/course.service';
import { CreateContentDto, UpdateContentDto } from './content.dto';
import { Content } from './content.entity';
import { ContentQuery } from './content.query';
import { UploadService } from '../upload/upload.service';
import { handleIlike } from '../helpers/handleIlike';
import { handleSort } from '../helpers/handleSort';
import { Pagination } from '../interfaces/pagination.interface';

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
    createContentDto: CreateContentDto,
    file: any,
  ): Promise<Content> {
    const course = await this.courseService.findById(courseId);

    if (file) {
      createContentDto.image = (
        await this.uploadService.uploadFile(file.buffer)
      ).file;
    }
    const lowerCaseName = createContentDto.name.toLowerCase();

    const content = this.contentRepository.create({
      name: createContentDto.name.toLowerCase(),
      description: createContentDto.description,
      image: createContentDto.image,
      course,
    });

    return await this.contentRepository.save(content);
  }

  async findAll(
    sortBy: string,
    page: number,
    limit: number,
    name: string,
    description: string,
  ): Promise<Pagination<Content>> {
    const order = handleSort(sortBy);
    const where = handleIlike({
      name,
      description,
    });

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
    sortBy: string,
    page: number,
    limit: number,
    name: string,
    description: string,
  ): Promise<Pagination<Content>> {
    const order = handleSort(sortBy);

    const where = handleIlike({
      name,
      description,
    });

    const [contents, total] = await this.contentRepository.findAndCount({
      where: { courseId, ...where },
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
      name: updateContentDto.name.toLowerCase(),
      description: updateContentDto.description,
      image: updateContentDto.image,
    });
  }

  async delete(courseId: string, id: string): Promise<DeleteResult> {
    const content = await this.findByCourseIdAndId(courseId, id);

    if (!content) {
      throw new HttpException(
        `Could not find content with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.contentRepository.delete(content.id);
  }

  async count(): Promise<number> {
    return await this.contentRepository.count();
  }
}
