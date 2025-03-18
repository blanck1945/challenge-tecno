// src/user-course-enrollment/user-course-enrollment.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Course } from '../course/course.entity';

@Entity('user_course_enrollment')
export class UserCourseEnrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.enrollments)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Course, (course) => course.enrollments)
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column({ default: true })
  enrolled: boolean;
}
