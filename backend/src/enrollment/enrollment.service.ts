import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCourseEnrollment } from './enrollment.entity';
import { User } from '../user/user.entity';
import { Course } from '../course/course.entity';
import { EnrolledStatus } from '../enums/enrolled.enum';

@Injectable()
export class UserCourseEnrollmentService {
  constructor(
    @InjectRepository(UserCourseEnrollment)
    private readonly enrollmentRepository: Repository<UserCourseEnrollment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async enrollUserInCourse(
    userId: string,
    courseId: string,
  ): Promise<UserCourseEnrollment> {
    const user = await this.userRepository.findOne(userId);
    const course = await this.courseRepository.findOne(courseId);

    if (!user || !course) {
      throw new Error('User or course not found');
    }

    const enrollment = this.enrollmentRepository.create({
      user,
      course,
      enrolled: true,
    });

    return this.enrollmentRepository.save(enrollment);
  }

  async reenrollUserInCourse(
    userId: string,
    courseId: string,
  ): Promise<UserCourseEnrollment> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { user: userId, course: courseId },
    });

    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    enrollment.enrolled = true;
    return this.enrollmentRepository.save(enrollment);
  }

  async unenrollUserFromCourse(
    userId: string,
    courseId: string,
  ): Promise<void> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { user: userId, course: courseId },
    });

    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    enrollment.enrolled = false;
    await this.enrollmentRepository.save(enrollment);
  }

  async getEnrolledCourses(userId: string): Promise<string[]> {
    const enrollments = await this.enrollmentRepository.find({
      where: { user: userId, enrolled: true },
      relations: ['course'],
    });

    return enrollments.map((e) => e.course.id);
  }

  async getCoursesNotEnrolled(userId: string): Promise<Course[]> {
    const enrollments = await this.enrollmentRepository.find({
      where: { user: userId, enrolled: false },
      relations: ['course'],
    });
    return enrollments.map((enrollment) => enrollment.course);
  }

  async isUserEnrolled(
    userId: string,
    courseId: string,
  ): Promise<{ enrolled: EnrolledStatus }> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { user: userId, course: courseId },
    });

    if (!enrollment) {
      return { enrolled: EnrolledStatus.NeverEnrolled };
    }

    return enrollment.enrolled
      ? { enrolled: EnrolledStatus.Enrolled }
      : { enrolled: EnrolledStatus.Unenrolled };
  }
}
