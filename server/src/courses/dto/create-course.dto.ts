import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'Англійська для початківців' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Базовий курс для старту вивчення англійської', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'https://example.com/image.png', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ default: "None" })
  @IsOptional()
  level?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}