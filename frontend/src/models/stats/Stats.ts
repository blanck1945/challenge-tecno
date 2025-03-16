import Course from '../course/Course';

export default interface Stats {
  numberOfUsers: number;
  numberOfCourses: number;
  numberOfContents: number;
  latestCourses: Course[];
  latestUpdatedCourse: Course[];
}
