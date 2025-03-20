import { Test, TestingModule } from '@nestjs/testing';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { ContentService } from '../content/content.service';
import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { CourseLanguages } from '../enums/courseLanguages.enum';

const mockCourseService = {
  findAll: jest.fn(),
  findById: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockContentService = {
  findAllByCourseId: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('CourseController', () => {
  let controller: CourseController;
  let courseService: CourseService;
  let contentService: ContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseController],
      providers: [
        {
          provide: CourseService,
          useValue: mockCourseService,
        },
        {
          provide: ContentService,
          useValue: mockContentService,
        },
      ],
    }).compile();

    controller = module.get<CourseController>(CourseController);
    courseService = module.get<CourseService>(CourseService);
    contentService = module.get<ContentService>(ContentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of courses with pagination', async () => {
      const result = {
        items: [
          {
            id: '1',
            name: 'Course 1',
            description: 'Description 1',
          },
        ],
        meta: {
          totalItems: 1,
          itemCount: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      };

      mockCourseService.findAll.mockResolvedValue(result);

      expect(await controller.findAll('name:ASC', 1, 10, '', '', '')).toBe(
        result,
      );
      expect(courseService.findAll).toHaveBeenCalledWith(
        'name:ASC',
        1,
        10,
        '',
        '',
        '',
      );
    });
  });

  describe('findOne', () => {
    it('should return a course', async () => {
      const result = {
        id: '1',
        name: 'Course 1',
        description: 'Description 1',
      };

      mockCourseService.findById.mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
      expect(courseService.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('findAllContentsByCourseId', () => {
    it('should return an array of contents with pagination', async () => {
      const result = {
        items: [
          {
            id: '1',
            name: 'Content 1',
            description: 'Description 1',
          },
        ],
        meta: {
          totalItems: 1,
          itemCount: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      };

      mockContentService.findAllByCourseId.mockResolvedValue(result);

      expect(
        await controller.findAllContentsByCourseId(
          '1',
          'name:ASC',
          1,
          10,
          '',
          '',
        ),
      ).toBe(result);
      expect(contentService.findAllByCourseId).toHaveBeenCalledWith(
        '1',
        'name:ASC',
        1,
        10,
        '',
        '',
      );
    });
  });

  describe('save', () => {
    it('should create a new course', async () => {
      const createCourseDto: CreateCourseDto = {
        name: 'New Course',
        description: 'New Description',
        language: CourseLanguages.English,
      };

      const result = {
        id: '1',
        ...createCourseDto,
      };

      mockCourseService.save.mockResolvedValue(result);

      expect(await controller.save(createCourseDto)).toBe(result);
      expect(courseService.save).toHaveBeenCalledWith(createCourseDto);
    });
  });

  describe('saveContent', () => {
    it('should create a new content', async () => {
      const createContentDto = {
        name: 'New Content',
        description: 'New Description',
      };

      const result = {
        id: '1',
        ...createContentDto,
      };

      mockContentService.save.mockResolvedValue(result);

      expect(await controller.saveContent('1', createContentDto, null)).toBe(
        result,
      );
      expect(contentService.save).toHaveBeenCalledWith(
        '1',
        createContentDto,
        null,
      );
    });
  });

  describe('update', () => {
    it('should update a course', async () => {
      const updateCourseDto: UpdateCourseDto = {
        name: 'Updated Course',
      };

      const result = {
        id: '1',
        ...updateCourseDto,
      };

      mockCourseService.update.mockResolvedValue(result);

      expect(await controller.update('1', updateCourseDto)).toBe(result);
      expect(courseService.update).toHaveBeenCalledWith('1', updateCourseDto);
    });
  });

  describe('updateContent', () => {
    it('should update a content', async () => {
      const updateContentDto = {
        name: 'Updated Content',
      };

      const result = {
        id: '1',
        ...updateContentDto,
      };

      mockContentService.update.mockResolvedValue(result);

      expect(
        await controller.updateContent('1', '1', updateContentDto, null),
      ).toBe(result);
      expect(contentService.update).toHaveBeenCalledWith(
        '1',
        '1',
        updateContentDto,
        null,
      );
    });
  });

  describe('delete', () => {
    it('should delete a course', async () => {
      mockCourseService.delete.mockResolvedValue('1');

      expect(await controller.delete('1')).toBe('1');
      expect(courseService.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('deleteContent', () => {
    it('should delete a content', async () => {
      mockContentService.delete.mockResolvedValue('1');

      expect(await controller.deleteContent('1', '1')).toBe('1');
      expect(contentService.delete).toHaveBeenCalledWith('1', '1');
    });
  });
});
