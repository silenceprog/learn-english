import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {  IsBoolean, IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';

export class FlashcardQueryDto {
  @ApiPropertyOptional({ description: 'Мова для карточок', enum: ['EN', 'UA', 'DE'] })
  @IsOptional()
  @IsEnum(['EN', 'UA', 'DE'])
  language?: 'EN' | 'UA' | 'DE';

  @ApiPropertyOptional({ description: 'Кількість карточок', minimum: 1, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Тільки слова для повторення' })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  reviewOnly?: boolean = false;

  @ApiPropertyOptional({ description: 'Рівень CEFR', enum: ['PRE_A1', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'] })
  @IsOptional()
  @IsEnum(['PRE_A1', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
  level?: string;
}