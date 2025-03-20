import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CourseLanguages } from '../enums/courseLanguages.enum';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(CourseLanguages)
  language: CourseLanguages;
}

export class UpdateCourseDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(CourseLanguages)
  language?: CourseLanguages;
}
