import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { Course } from './course.entity';
import { CourseQuery } from './course.query';
import { handleIlike } from 'src/helpers/handleIlike';
import { handleSort } from 'src/helpers/handleSort';
import { Pagination } from 'src/interfaces/pagination.interface';
import { Order } from 'src/enums/order.enum';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async save(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.courseRepository.create({
      ...createCourseDto,
    });
    return await this.courseRepository.save(course);
  }

  async findAll(courseQuery: CourseQuery): Promise<Pagination<Course>> {
    const { sortBy, page, limit } = courseQuery;

    const whereQuery = handleIlike(courseQuery, ['name', 'description']);
    const orderBy = handleSort(sortBy, {
      name: Order.ASC,
      description: Order.ASC,
    });

    const [courses, total] = await this.courseRepository.findAndCount({
      where: {
        ...whereQuery,
        ...(courseQuery.language && { language: courseQuery.language }),
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
      ...updateCourseDto,
      updatedAt: new Date(),
    });
    return await this.courseRepository.save(updatedCourse);
  }

  async delete(id: string): Promise<string> {
    const course = await this.findById(id);

    if (!course) {
      throw new HttpException(
        `Course with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.courseRepository.delete(course.id);
    return id;
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
