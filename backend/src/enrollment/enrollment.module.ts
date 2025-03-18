// src/user-course-enrollment/user-course-enrollment.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCourseEnrollment } from './enrollment.entity';
import { UserCourseEnrollmentService } from './enrollment.service';
import { UserCourseEnrollmentController } from './enrollment.controller';
import { User } from '../user/user.entity';
import { Course } from '../course/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserCourseEnrollment, User, Course])],
  providers: [UserCourseEnrollmentService],
  controllers: [UserCourseEnrollmentController],
})
export class UserCourseEnrollmentModule {}
