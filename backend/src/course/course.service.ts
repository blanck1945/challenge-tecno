import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { Course } from './course.entity';
import { handleIlike } from '../helpers/handleIlike';
import { handleSort } from '../helpers/handleSort';
import { Pagination } from '../interfaces/pagination.interface';
import { Order } from '../enums/order.enum';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async save(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.courseRepository.create({
      name: createCourseDto.name.toLowerCase(),
      description: createCourseDto.description.toLowerCase(),
      language: createCourseDto.language,
    });
    return await this.courseRepository.save(course);
  }

  async findAll(
    sortBy: string,
    page: number,
    limit: number,
    name: string,
    description: string,
    language: string,
  ): Promise<Pagination<Course>> {
    const whereQuery = handleIlike({
      name,
      description,
    });

    const orderBy = handleSort(sortBy);

    const [courses, total] = await this.courseRepository.findAndCount({
      where: {
        ...whereQuery,
        ...(language && { language }),
      },
      order: orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      results: courses,
      total,
      page: +page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne(id);
    if (!course) {
      throw new HttpException(
        `Could not find course with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findById(id);
    const updatedCourse = this.courseRepository.create({
      id: course.id,
      name: updateCourseDto.name.toLowerCase(),
      description: updateCourseDto.description,
      language: updateCourseDto.language,
      updatedAt: new Date(),
    });
    return await this.courseRepository.save(updatedCourse);
  }

  async delete(courseId: string): Promise<DeleteResult> {
    const course = await this.findById(courseId);
    if (!course) {
      throw new HttpException(
        `Course with id ${courseId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return await this.courseRepository.delete(course.id);
  }

  async count(): Promise<number> {
    return await this.courseRepository.count();
  }

  async latest(): Promise<Course[]> {
    return await this.courseRepository.find({
      take: 3,
      order: {
        createdAt: Order.DESC,
      },
    });
  }

  async latestUpdated(): Promise<Course[]> {
    return await this.courseRepository.find({
      take: 2,
      order: { updatedAt: Order.ASC },
    });
  }
}
