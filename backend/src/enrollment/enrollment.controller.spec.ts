import { Test, TestingModule } from '@nestjs/testing';
import { UserCourseEnrollmentController } from './enrollment.controller';
import { UserCourseEnrollmentService } from './enrollment.service';
import { EnrolledStatus } from '../enums/enrolled.enum';

describe('UserCourseEnrollmentController', () => {
  let controller: UserCourseEnrollmentController;
  let service: UserCourseEnrollmentService;

  const mockEnrollmentService = {
    enrollUserInCourse: jest.fn(),
    reenrollUserInCourse: jest.fn(),
    unenrollUserFromCourse: jest.fn(),
    getEnrolledCourses: jest.fn(),
    isUserEnrolled: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserCourseEnrollmentController],
      providers: [
        {
          provide: UserCourseEnrollmentService,
          useValue: mockEnrollmentService,
        },
      ],
    }).compile();

    controller = module.get<UserCourseEnrollmentController>(
      UserCourseEnrollmentController,
    );
    service = module.get<UserCourseEnrollmentService>(
      UserCourseEnrollmentService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('enrollUserInCourse', () => {
    it('should enroll a user in a course', async () => {
      const userId = 'user123';
      const courseId = 'course123';
      const expectedResult = { status: 'enrolled' };

      mockEnrollmentService.enrollUserInCourse.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.enrollUserInCourse(userId, courseId);

      expect(result).toEqual(expectedResult);
      expect(service.enrollUserInCourse).toHaveBeenCalledWith(userId, courseId);
    });
  });

  describe('reenrollUserInCourse', () => {
    it('should reenroll a user in a course', async () => {
      const userId = 'user123';
      const courseId = 'course123';
      const expectedResult = { status: 'reenrolled' };

      mockEnrollmentService.reenrollUserInCourse.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.reenrollUserInCourse(userId, courseId);

      expect(result).toEqual(expectedResult);
      expect(service.reenrollUserInCourse).toHaveBeenCalledWith(
        userId,
        courseId,
      );
    });
  });

  describe('unenrollUserFromCourse', () => {
    it('should unenroll a user from a course', async () => {
      const userId = 'user123';
      const courseId = 'course123';
      const expectedResult = { status: 'unenrolled' };

      mockEnrollmentService.unenrollUserFromCourse.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.unenrollUserFromCourse(userId, courseId);

      expect(result).toEqual(expectedResult);
      expect(service.unenrollUserFromCourse).toHaveBeenCalledWith(
        userId,
        courseId,
      );
    });
  });

  describe('getEnrolledCourses', () => {
    it('should get all enrolled courses for a user', async () => {
      const userId = 'user123';
      const expectedResult = [{ courseId: 'course123', name: 'Course 1' }];

      mockEnrollmentService.getEnrolledCourses.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.getEnrolledCourses(userId);

      expect(result).toEqual(expectedResult);
      expect(service.getEnrolledCourses).toHaveBeenCalledWith(userId);
    });
  });

  describe('isUserEnrolled', () => {
    it('should check if a user is enrolled in a course', async () => {
      const userId = 'user123';
      const courseId = 'course123';
      const expectedResult = { enrolled: EnrolledStatus.Enrolled };

      mockEnrollmentService.isUserEnrolled.mockResolvedValue(expectedResult);

      const result = await controller.isUserEnrolled(userId, courseId);

      expect(result).toEqual(expectedResult);
      expect(service.isUserEnrolled).toHaveBeenCalledWith(userId, courseId);
    });
  });
});
