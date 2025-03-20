import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FavoritesService } from '../favorites/favorites.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { Role } from '../enums/role.enum';
import { User } from './user.entity';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  let favoritesService: FavoritesService;

  const mockUserService = {
    save: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getFavorites: jest.fn(),
  };

  const mockFavoritesService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: FavoritesService,
          useValue: mockFavoritesService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    favoritesService = module.get<FavoritesService>(FavoritesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      const expectedUser = {
        id: '1',
        ...createUserDto,
      };

      mockUserService.save.mockResolvedValue(expectedUser);

      const result = await controller.save(createUserDto);
      expect(result).toEqual(expectedUser);
      expect(userService.save).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const expectedResponse = {
        results: [
          {
            id: '1',
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
          },
        ],
        total: 1,
        page: 1,
        lastPage: 1,
      };

      mockUserService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(
        'firstName:ASC',
        1,
        10,
        'Test',
        'User',
        'testuser',
        Role.User,
      );

      expect(result).toEqual(expectedResponse);
      expect(userService.findAll).toHaveBeenCalledWith(
        'firstName:ASC',
        1,
        10,
        'Test',
        'User',
        'testuser',
        Role.User,
      );
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const expectedUser = {
        id: '1',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
      };

      mockUserService.findById.mockResolvedValue(expectedUser);

      const result = await controller.findOne('1');
      expect(result).toEqual(expectedUser);
      expect(userService.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('getFavorites', () => {
    it('should return user favorites', async () => {
      const expectedUser = {
        id: '1',
        username: 'testuser',
        favorites: [
          {
            id: '1',
            courseId: '1',
          },
        ],
      };

      mockUserService.getFavorites.mockResolvedValue(expectedUser);

      const result = await controller.getFavorites('1');
      expect(result).toEqual(expectedUser);
      expect(userService.getFavorites).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'Updated',
        lastName: 'User',
      };

      const expectedUser = {
        id: '1',
        username: 'testuser',
        ...updateUserDto,
      };

      mockUserService.update.mockResolvedValue(expectedUser);

      const result = await controller.update('1', updateUserDto);
      expect(result).toEqual(expectedUser);
      expect(userService.update).toHaveBeenCalledWith('1', updateUserDto);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const userId = '1';
      mockUserService.delete.mockResolvedValue(userId);

      const result = await controller.delete(userId);
      expect(result).toBe(userId);
      expect(userService.delete).toHaveBeenCalledWith(userId);
    });
  });
});
