import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { Course } from './course.entity';
import { CourseQuery } from './course.query';
import { handleIlike } from 'src/helpers/handleIlike';
import { handleSort } from 'src/helpers/handleSort';
import { Pagination } from 'src/interfaces/pagination.interface';
import { Favorite } from 'src/favorites/favorites.entity';
import { Order } from 'src/enums/order.enum';

@Injectable()
export class CourseService {
  async save(createCourseDto: CreateCourseDto): Promise<Course> {
    return await Course.create({
      ...createCourseDto,
      dateCreated: new Date(),
    }).save();
  }

  async findAll(courseQuery: CourseQuery): Promise<Pagination<Course>> {
    const { sortBy, page, limit } = courseQuery;

    const whereQuery = handleIlike(courseQuery, ['name', 'description']);
    const orderBy = handleSort(sortBy, {
      name: Order.ASC,
      description: Order.ASC,
    });

    const [courses, total] = await Course.findAndCount({
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

  async findById(id: string): Promise<any> {
    const course = await Course.findOne(id);
    if (!course) {
      throw new HttpException(
        `Could not find course with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    const favorites = await Favorite.findOne({
      where: { courseId: id },
    });

    return { ...course, isFavorite: favorites ? true : false };
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findById(id);
    return await Course.create({
      id: course.id,
      ...updateCourseDto,
      dateUpdated: new Date(),
    }).save();
  }

  async delete(id: string): Promise<string> {
    const course = await this.findById(id);
    await Course.delete(course);
    return id;
  }

  async count(): Promise<number> {
    return await Course.count();
  }

  async latest(): Promise<Course[]> {
    return await Course.find({
      take: 3,
      order: {
        dateCreated: 'DESC',
      },
    });
  }

  async latestUpdated(): Promise<Course[]> {
    return await Course.find({
      take: 2,
      order: { dateUpdated: 'ASC' },
    });
  }
}
