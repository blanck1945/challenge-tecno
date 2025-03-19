import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRankingDto {
  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @IsOptional()
  @IsString()
  message: string;
}
