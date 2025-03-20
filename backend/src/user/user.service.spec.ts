import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { HttpException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '../enums/role.enum';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('save', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        role: Role.User,
      };

      const hashedPassword = 'hashedPassword';
      const user = { ...createUserDto, id: '1', password: hashedPassword };

      jest.spyOn(service, 'findByUsername').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      mockRepository.create.mockReturnValue(user);
      mockRepository.save.mockResolvedValue(user);

      const result = await service.save(createUserDto);
      expect(result).toEqual(user);
    });

    it('should throw error if username exists', async () => {
      const createUserDto: CreateUserDto = {
        username: 'existinguser',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        role: Role.User,
      };

      jest
        .spyOn(service, 'findByUsername')
        .mockResolvedValue({ id: '1' } as User);

      await expect(service.save(createUserDto)).rejects.toThrow(HttpException);
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const users = [{ id: '1', username: 'test' }];
      const total = 1;
      mockRepository.findAndCount.mockResolvedValue([users, total]);

      const result = await service.findAll(
        'id:ASC',
        1,
        10,
        '',
        '',
        '',
        Not(IsNull()),
      );

      expect(result).toEqual({
        results: users,
        total,
        page: 1,
        lastPage: 1,
      });
    });
  });

  describe('findById', () => {
    it('should return a user', async () => {
      const user = { id: '1', username: 'test' };
      mockRepository.findOne.mockResolvedValue(user);

      const result = await service.findById('1');
      expect(result).toEqual(user);
    });

    it('should throw error if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findById('1')).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'Updated',
      };

      const existingUser = {
        id: '1',
        username: 'test',
        firstName: 'Test',
      };

      const updatedUser = { ...existingUser, ...updateUserDto };

      jest.spyOn(service, 'findById').mockResolvedValue(existingUser as User);
      mockRepository.create.mockReturnValue(updatedUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update('1', updateUserDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const user = { id: '1', username: 'test' };
      jest.spyOn(service, 'findById').mockResolvedValue(user as User);
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.delete('1');
      expect(result).toEqual('1');
    });
  });

  describe('setRefreshToken', () => {
    it('should set refresh token', async () => {
      const user = { id: '1', username: 'test' };
      const refreshToken = 'token123';
      const hashedToken = 'hashedToken';

      jest.spyOn(service, 'findById').mockResolvedValue(user as User);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedToken);

      await service.setRefreshToken('1', refreshToken);

      expect(repository.update).toHaveBeenCalledWith(user, {
        refreshToken: hashedToken,
      });
    });
  });

  describe('getFavorites', () => {
    it('should return user with favorites', async () => {
      const user = { id: '1', username: 'test', favorites: [] };
      mockRepository.findOne.mockResolvedValue(user);

      const result = await service.getFavorites('1');
      expect(result).toEqual(user);
    });
  });
});
