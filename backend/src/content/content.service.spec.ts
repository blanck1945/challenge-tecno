import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CreateContentDto, UpdateContentDto } from './content.dto';
import { ContentService } from './content.service';
import { Content } from './content.entity';
import { CourseService } from '../course/course.service';
import { UploadService } from '../upload/upload.service';

const mockUploadService = {
  uploadFile: jest.fn().mockImplementation((buffer) => {
    return Promise.resolve({ file: 'mocked-file-url' });
  }),
};

const mockCourseService = {
  findById: jest.fn().mockImplementation((id) => {
    return Promise.resolve({
      id,
      name: 'test course',
    });
  }),
};

const mockRepository = {
  create: jest.fn().mockImplementation((dto) => dto),
  save: jest.fn().mockImplementation((content) => content),
  findOne: jest.fn(),
  findAndCount: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
};

describe('ContentService', () => {
  let service: ContentService;
  let uploadService: UploadService;
  let courseService: CourseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        {
          provide: UploadService,
          useValue: mockUploadService,
        },
        {
          provide: CourseService,
          useValue: mockCourseService,
        },
        {
          provide: getRepositoryToken(Content),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ContentService>(ContentService);
    uploadService = module.get<UploadService>(UploadService);
    courseService = module.get<CourseService>(CourseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveContent', () => {
    it('should get the saved content', async () => {
      const createContentDto = {
        name: 'test',
        description: 'test',
      };

      mockRepository.save.mockResolvedValue({
        id: 'testid',
        dateCreated: new Date(),
        ...createContentDto,
      });

      const content = await service.save(
        'testcourseid',
        createContentDto,
        null,
      );

      expect(content).toEqual({
        id: 'testid',
        name: 'test',
        description: 'test',
        dateCreated: expect.any(Date),
      });
    });

    it('should save content with file', async () => {
      const mockFile = {
        buffer: Buffer.from('test'),
      };
      const createContentDto = {
        name: 'test',
        description: 'test',
      };

      mockRepository.save.mockResolvedValue({
        id: 'testid',
        dateCreated: new Date(),
        ...createContentDto,
        image: 'mocked-file-url',
      });

      const content = await service.save(
        'testcourseid',
        createContentDto,
        mockFile,
      );

      expect(content).toEqual({
        id: 'testid',
        name: 'test',
        description: 'test',
        dateCreated: expect.any(Date),
        image: 'mocked-file-url',
      });
      expect(uploadService.uploadFile).toHaveBeenCalledWith(mockFile.buffer);
    });
  });

  describe('findAllContent', () => {
    it('should get the list of all contents', async () => {
      const mockContents = [
        {
          id: 'testid1',
          name: 'test1',
          description: 'test1',
          dateCreated: new Date(),
        },
        {
          id: 'testid2',
          name: 'test2',
          description: 'test2',
          dateCreated: new Date(),
        },
      ];

      mockRepository.findAndCount.mockResolvedValue([mockContents, 2]);

      const result = await service.findAll('name:ASC', 1, 10, 'test', 'test');

      expect(result).toEqual({
        results: mockContents,
        page: 1,
        total: 2,
        lastPage: 1,
      });
    });
  });

  describe('findContentById', () => {
    it('should get a content by id', async () => {
      const mockContent = {
        id: 'testid',
        name: 'test',
        description: 'test',
        dateCreated: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockContent);

      const content = await service.findById('testid');

      expect(content).toEqual(mockContent);
    });
  });

  describe('findByCourseIdAndId', () => {
    it('should get a content', async () => {
      const mockContent = {
        id: 'testid',
        name: 'test',
        description: 'test',
        dateCreated: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockContent);

      const content = await service.findByCourseIdAndId(
        'testcourseid',
        'testid',
      );

      expect(content).toEqual(mockContent);
    });
  });

  describe('findAllByCourseId', () => {
    it('should get the array of contents', async () => {
      const mockContents = [
        {
          id: 'testid1',
          name: 'test1',
          description: 'test1',
          dateCreated: new Date(),
        },
        {
          id: 'testid2',
          name: 'test2',
          description: 'test2',
          dateCreated: new Date(),
        },
      ];

      mockRepository.findAndCount.mockResolvedValue([mockContents, 2]);

      const result = await service.findAllByCourseId(
        'testcourseid',
        'name:ASC',
        1,
        10,
        'test',
        'test',
      );

      expect(result).toEqual({
        results: mockContents,
        page: 1,
        total: 2,
        lastPage: 1,
      });
    });
  });

  describe('updateContent', () => {
    it('should update a content and return changed values', async () => {
      const mockContent = {
        id: 'testcontentid',
        name: 'test',
        description: 'test',
      };

      mockRepository.findOne.mockResolvedValue(mockContent);
      mockRepository.save.mockResolvedValue(mockContent);

      const updatedContent = await service.update(
        'testid',
        'testcontentid',
        {
          name: 'test',
          description: 'test',
        },
        null,
      );

      expect(updatedContent).toEqual(mockContent);
    });

    it('should update content with file', async () => {
      const mockFile = {
        buffer: Buffer.from('test'),
      };
      const mockContent = {
        id: 'testcontentid',
        name: 'test',
        description: 'test',
        image: 'mocked-file-url',
      };

      mockRepository.findOne.mockResolvedValue(mockContent);
      mockRepository.save.mockResolvedValue(mockContent);

      const updatedContent = await service.update(
        'testid',
        'testcontentid',
        {
          name: 'test',
          description: 'test',
        },
        mockFile,
      );

      expect(updatedContent).toEqual(mockContent);
      expect(uploadService.uploadFile).toHaveBeenCalledWith(mockFile.buffer);
    });
  });

  describe('deleteContent', () => {
    it('should delete a content and return the id', async () => {
      const mockContent = {
        id: 'testcontentid',
        name: 'test',
        description: 'test',
      };

      mockRepository.findOne.mockResolvedValue(mockContent);
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const id = await service.delete('testid', 'testcontentid');
      expect(id).toEqual({ affected: 1 });
    });
  });

  describe('countContents', () => {
    it('should get number of contents', async () => {
      mockRepository.count.mockResolvedValue(10);
      const count = await service.count();
      expect(count).toBe(10);
    });
  });
});
