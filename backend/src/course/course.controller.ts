import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Content } from '../content/content.entity';
import { ContentService } from '../content/content.service';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { Course } from './course.entity';
import { CourseService } from './course.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Pagination } from 'src/interfaces/pagination.interface';
import { DeleteResult } from 'typeorm';

@Controller('courses')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@ApiTags('Courses')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly contentService: ContentService,
  ) {}

  @Get()
  async findAll(
    @Query('sortBy', new DefaultValuePipe('name:ASC')) sortBy: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('name', new DefaultValuePipe('')) name: string,
    @Query('description', new DefaultValuePipe('')) description: string,
    @Query('language', new DefaultValuePipe('')) language: string,
  ): Promise<Pagination<Course>> {
    return await this.courseService.findAll(
      sortBy,
      page,
      limit,
      name,
      description,
      language,
    );
  }

  @Get('/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Course> {
    return await this.courseService.findById(id);
  }

  @Get('/:id/contents')
  async findAllContentsByCourseId(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('sortBy', new DefaultValuePipe('name:ASC')) sortBy: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('name', new DefaultValuePipe('')) name: string,
    @Query('description', new DefaultValuePipe('')) description: string,
  ): Promise<Pagination<Content>> {
    return await this.contentService.findAllByCourseId(
      id,
      sortBy,
      page,
      limit,
      name,
      description,
    );
  }

  @Post()
  @Roles(Role.Admin, Role.Editor)
  async save(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return await this.courseService.save(createCourseDto);
  }

  @Post('/:id/contents')
  @Roles(Role.Admin, Role.Editor)
  @UseInterceptors(FileInterceptor('image'))
  async saveContent(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createContentDto: any,
    @UploadedFile() file = null,
  ): Promise<Content> {
    return await this.contentService.save(id, createContentDto, file);
  }

  @Put('/:id')
  @Roles(Role.Admin, Role.Editor)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    return await this.courseService.update(id, updateCourseDto);
  }

  @Put('/:id/contents/:contentId')
  @Roles(Role.Admin, Role.Editor)
  @UseInterceptors(FileInterceptor('image'))
  async updateContent(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('contentId', ParseUUIDPipe) contentId: string,
    @Body() updateContentDto: UpdateCourseDto,
    @UploadedFile() file = null,
  ): Promise<Content> {
    return await this.contentService.update(
      id,
      contentId,
      updateContentDto,
      file,
    );
  }

  @Delete('/:id/contents/:contentId')
  @Roles(Role.Admin)
  async deleteContent(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('contentId', ParseUUIDPipe) contentId: string,
  ): Promise<DeleteResult> {
    return await this.contentService.delete(id, contentId);
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteResult> {
    return await this.courseService.delete(id);
  }
}
