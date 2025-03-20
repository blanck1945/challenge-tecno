import { CourseQuery } from 'src/course/course.query';
import { ILike } from 'typeorm';

export const handleIlike = (validFields: {
  [key: string]: string;
}): Omit<CourseQuery, 'sortBy'> => {
  let where = {};

  Object.keys(validFields).forEach((key) => {
    if (!validFields[key]) return;

    where[key] = ILike(`%${validFields[key]}%`);
  });
  return where;
};
