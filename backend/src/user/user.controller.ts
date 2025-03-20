import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserGuard } from '../auth/guards/user.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Pagination } from '../interfaces/pagination.interface';
import { FavoritesService } from '../favorites/favorites.service';
import { FindOperator, IsNull, Not } from 'typeorm';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly favoriteService: FavoritesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.Admin)
  async save(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.save(createUserDto);
  }

  @Get()
  @Roles(Role.Admin)
  async findAll(
    @Query('sortBy', new DefaultValuePipe('firstName:ASC')) sortBy: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('firstName', new DefaultValuePipe('')) firstName: string,
    @Query('lastName', new DefaultValuePipe('')) lastName: string,
    @Query('username', new DefaultValuePipe('')) username: string,
    @Query('role', new DefaultValuePipe(Not(IsNull())))
    role: Role | FindOperator<Role>,
  ): Promise<Pagination<User>> {
    return await this.userService.findAll(
      sortBy,
      page,
      limit,
      firstName,
      lastName,
      username,
      role,
    );
  }

  @Get('/:id')
  @UseGuards(UserGuard)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return await this.userService.findById(id);
  }

  @Get(':id/favorites')
  async getFavorites(
    @Param('id', ParseUUIDPipe) userId: string,
  ): Promise<User> {
    return this.userService.getFavorites(userId);
  }

  @Put('/:id')
  @UseGuards(UserGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<string> {
    return await this.userService.delete(id);
  }
}
