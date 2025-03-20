import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseService } from './course.service';
import { Course } from './course.entity';
import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { HttpException } from '@nestjs/common';
import { CourseLanguages } from '../enums/courseLanguages.enum';

describe('CourseService', () => {
  let service: CourseService;
  let repository: Repository<Course>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        {
          provide: getRepositoryToken(Course),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
    repository = module.get<Repository<Course>>(getRepositoryToken(Course));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('save', () => {
    it('should successfully create a course', async () => {
      const createCourseDto: CreateCourseDto = {
        name: 'Test Course',
        description: 'Test Description',
        language: CourseLanguages.English,
      };

      const course = { id: '1', ...createCourseDto };
      mockRepository.create.mockReturnValue(course);
      mockRepository.save.mockResolvedValue(course);

      const result = await service.save(createCourseDto);
      expect(result).toEqual(course);
    });
  });

  describe('findAll', () => {
    it('should return paginated courses', async () => {
      const courses = [
        { id: '1', name: 'Course 1' },
        { id: '2', name: 'Course 2' },
      ];
      const total = 2;

      mockRepository.findAndCount.mockResolvedValue([courses, total]);

      const result = await service.findAll('name:ASC', 1, 10, '', '', '');

      expect(result).toEqual({
        results: courses,
        total,
        page: 1,
        lastPage: 1,
      });
    });
  });

  describe('findById', () => {
    it('should return a course by id', async () => {
      const course = { id: '1', name: 'Test Course' };
      mockRepository.findOne.mockResolvedValue(course);

      const result = await service.findById('1');
      expect(result).toEqual(course);
    });

    it('should throw an error if course not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findById('1')).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should update a course', async () => {
      const updateCourseDto: UpdateCourseDto = {
        name: 'Updated Course',
      };
      const existingCourse = { id: '1', name: 'Old Name' };
      const updatedCourse = { id: '1', name: 'Updated Course' };

      mockRepository.findOne.mockResolvedValue(existingCourse);
      mockRepository.create.mockReturnValue(updatedCourse);
      mockRepository.save.mockResolvedValue(updatedCourse);

      const result = await service.update('1', updateCourseDto);
      expect(result).toEqual(updatedCourse);
    });
  });

  describe('delete', () => {
    it('should return delete result on successful deletion', async () => {
      const courseId = '1';
      const course = { id: courseId, name: 'Test Course' };
      const deleteResult = { affected: 1 };

      mockRepository.findOne.mockResolvedValue(course);
      mockRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.delete(courseId);
      expect(result).toEqual(deleteResult);
    });

    it('should throw an error if course not found for deletion', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.delete('1')).rejects.toThrow(HttpException);
    });
  });

  describe('count', () => {
    it('should return the total number of courses', async () => {
      const count = 5;
      mockRepository.count.mockResolvedValue(count);

      const result = await service.count();
      expect(result).toBe(count);
    });
  });

  describe('latest', () => {
    it('should return the latest 3 courses', async () => {
      const courses = [
        { id: '1', name: 'Course 1' },
        { id: '2', name: 'Course 2' },
        { id: '3', name: 'Course 3' },
      ];

      mockRepository.find.mockResolvedValue(courses);

      const result = await service.latest();
      expect(result).toEqual(courses);
    });
  });

  describe('latestUpdated', () => {
    it('should return the latest 2 updated courses', async () => {
      const courses = [
        { id: '1', name: 'Course 1' },
        { id: '2', name: 'Course 2' },
      ];

      mockRepository.find.mockResolvedValue(courses);

      const result = await service.latestUpdated();
      expect(result).toEqual(courses);
    });
  });
});
