import {
  Controller,
  Post,
  Delete,
  Param,
  Get,
  UseGuards,
} from '@nestjs/common';
import { UserCourseEnrollmentService } from './enrollment.service';
import { EnrolledStatus } from '../enums/enrolled.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@Controller('enrollments')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@ApiTags('Enrollments')
export class UserCourseEnrollmentController {
  constructor(
    private readonly enrollmentService: UserCourseEnrollmentService,
  ) {}

  @Post(':userId/:courseId')
  @Roles(Role.User)
  async enrollUserInCourse(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.enrollmentService.enrollUserInCourse(userId, courseId);
  }

  @Post(':userId/:courseId/reenroll')
  @Roles(Role.User)
  async reenrollUserInCourse(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.enrollmentService.reenrollUserInCourse(userId, courseId);
  }

  @Delete(':userId/:courseId')
  @Roles(Role.User)
  async unenrollUserFromCourse(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.enrollmentService.unenrollUserFromCourse(userId, courseId);
  }

  @Get(':userId')
  @Roles(Role.User)
  async getEnrolledCourses(@Param('userId') userId: string) {
    return this.enrollmentService.getEnrolledCourses(userId);
  }

  @Get(':userId/:courseId/is-enrolled')
  @Roles(Role.User)
  async isUserEnrolled(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ): Promise<{ enrolled: EnrolledStatus }> {
    return this.enrollmentService.isUserEnrolled(userId, courseId);
  }
}
