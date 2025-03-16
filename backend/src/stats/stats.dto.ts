import { Course } from 'src/course/course.entity';

export interface StatsResponseDto {
  numberOfUsers: number;
  numberOfCourses: number;
  numberOfContents: number;
  latestCourses: Course[];
  latestUpdatedCourse: Course[];
}
