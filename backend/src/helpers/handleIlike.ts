import { CourseQuery } from 'src/course/course.query';
import { ILike } from 'typeorm';

export const handleIlike = (
  whereQuery,
  validFields: string[],
): Omit<CourseQuery, 'sortBy'> => {
  let where = {};
  validFields.forEach((key) => {
    if (whereQuery[key]) {
      where[key] = ILike(`%${whereQuery[key]}%`);
    }
  });
  return where;
};
