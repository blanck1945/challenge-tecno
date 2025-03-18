// src/user-course-enrollment/user-course-enrollment.controller.ts
import { Controller, Post, Delete, Param, Get } from '@nestjs/common';
import { UserCourseEnrollmentService } from './enrollment.service';
import { EnrolledStatus } from 'src/enums/enrolled.enum';

@Controller('enrollments')
export class UserCourseEnrollmentController {
  constructor(
    private readonly enrollmentService: UserCourseEnrollmentService,
  ) {}

  @Post(':userId/:courseId')
  async enrollUserInCourse(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.enrollmentService.enrollUserInCourse(userId, courseId);
  }

  @Post(':userId/:courseId/reenroll')
  async reenrollUserInCourse(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.enrollmentService.reenrollUserInCourse(userId, courseId);
  }

  @Delete(':userId/:courseId')
  async unenrollUserFromCourse(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.enrollmentService.unenrollUserFromCourse(userId, courseId);
  }

  @Get(':userId')
  async getEnrolledCourses(@Param('userId') userId: string) {
    return this.enrollmentService.getEnrolledCourses(userId);
  }

  @Get(':userId/:courseId/is-enrolled')
  async isUserEnrolled(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ): Promise<{ enrolled: EnrolledStatus }> {
    return this.enrollmentService.isUserEnrolled(userId, courseId);
  }
}
