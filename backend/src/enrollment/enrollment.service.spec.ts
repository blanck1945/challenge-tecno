import { Test, TestingModule } from '@nestjs/testing';
import { UserCourseEnrollmentService } from './enrollment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserCourseEnrollment } from './enrollment.entity';
import { User } from '../user/user.entity';
import { Course } from '../course/course.entity';
import { Repository } from 'typeorm';
import { EnrolledStatus } from '../enums/enrolled.enum';

describe('EnrollmentService', () => {
  let service: UserCourseEnrollmentService;
  let enrollmentRepository: Repository<UserCourseEnrollment>;
  let userRepository: Repository<User>;
  let courseRepository: Repository<Course>;

  const mockEnrollmentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockCourseRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCourseEnrollmentService,
        {
          provide: getRepositoryToken(UserCourseEnrollment),
          useValue: mockEnrollmentRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Course),
          useValue: mockCourseRepository,
        },
      ],
    }).compile();

    service = module.get<UserCourseEnrollmentService>(
      UserCourseEnrollmentService,
    );
    enrollmentRepository = module.get(getRepositoryToken(UserCourseEnrollment));
    userRepository = module.get(getRepositoryToken(User));
    courseRepository = module.get(getRepositoryToken(Course));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('enrollUserInCourse', () => {
    it('should successfully enroll a user in a course', async () => {
      const mockUser = { id: '1' } as User;
      const mockCourse = { id: '1' } as Course;
      const mockEnrollment = {
        user: mockUser,
        course: mockCourse,
        enrolled: true,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockCourseRepository.findOne.mockResolvedValue(mockCourse);
      mockEnrollmentRepository.create.mockReturnValue(mockEnrollment);
      mockEnrollmentRepository.save.mockResolvedValue(mockEnrollment);

      const result = await service.enrollUserInCourse('1', '1');

      expect(result).toEqual(mockEnrollment);
      expect(mockEnrollmentRepository.create).toHaveBeenCalledWith({
        user: mockUser,
        course: mockCourse,
        enrolled: true,
      });
    });

    it('should throw error if user or course not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockCourseRepository.findOne.mockResolvedValue(null);

      await expect(service.enrollUserInCourse('1', '1')).rejects.toThrow(
        'User or course not found',
      );
    });
  });

  describe('reenrollUserInCourse', () => {
    it('should successfully reenroll a user in a course', async () => {
      const mockEnrollment = { enrolled: false };
      mockEnrollmentRepository.findOne.mockResolvedValue(mockEnrollment);
      mockEnrollmentRepository.save.mockResolvedValue({
        ...mockEnrollment,
        enrolled: true,
      });

      const result = await service.reenrollUserInCourse('1', '1');

      expect(result.enrolled).toBe(true);
    });

    it('should throw error if enrollment not found', async () => {
      mockEnrollmentRepository.findOne.mockResolvedValue(null);

      await expect(service.reenrollUserInCourse('1', '1')).rejects.toThrow(
        'Enrollment not found',
      );
    });
  });

  describe('unenrollUserFromCourse', () => {
    it('should successfully unenroll a user from a course', async () => {
      const mockEnrollment = { enrolled: true };
      mockEnrollmentRepository.findOne.mockResolvedValue(mockEnrollment);
      mockEnrollmentRepository.save.mockResolvedValue({
        ...mockEnrollment,
        enrolled: false,
      });

      await service.unenrollUserFromCourse('1', '1');

      expect(mockEnrollmentRepository.save).toHaveBeenCalledWith({
        enrolled: false,
      });
    });
  });

  describe('isUserEnrolled', () => {
    it('should return NeverEnrolled when no enrollment exists', async () => {
      mockEnrollmentRepository.findOne.mockResolvedValue(null);

      const result = await service.isUserEnrolled('1', '1');

      expect(result).toEqual({ enrolled: EnrolledStatus.NeverEnrolled });
    });

    it('should return Enrolled when user is enrolled', async () => {
      mockEnrollmentRepository.findOne.mockResolvedValue({ enrolled: true });

      const result = await service.isUserEnrolled('1', '1');

      expect(result).toEqual({ enrolled: EnrolledStatus.Enrolled });
    });

    it('should return Unenrolled when user was enrolled but unenrolled', async () => {
      mockEnrollmentRepository.findOne.mockResolvedValue({ enrolled: false });

      const result = await service.isUserEnrolled('1', '1');

      expect(result).toEqual({ enrolled: EnrolledStatus.Unenrolled });
    });
  });

  describe('getEnrolledCourses', () => {
    it('should return array of enrolled course ids', async () => {
      const mockEnrollments = [
        { course: { id: '1' }, enrolled: true },
        { course: { id: '2' }, enrolled: true },
      ];
      mockEnrollmentRepository.find.mockResolvedValue(mockEnrollments);

      const result = await service.getEnrolledCourses('1');

      expect(result).toEqual(['1', '2']);
    });

    it('should handle empty enrollments array', async () => {
      mockEnrollmentRepository.find.mockResolvedValue([]);

      const result = await service.getEnrolledCourses('1');

      expect(result).toEqual([]);
    });
  });

  describe('getCoursesNotEnrolled', () => {
    it('should return array of courses user is not enrolled in', async () => {
      const mockCourses = [
        { id: '1', name: 'Course 1' },
        { id: '2', name: 'Course 2' },
      ];
      mockEnrollmentRepository.find.mockResolvedValue([
        { course: mockCourses[0] },
        { course: mockCourses[1] },
      ]);

      const result = await service.getCoursesNotEnrolled('1');

      expect(result).toEqual(mockCourses);
    });
  });
});
