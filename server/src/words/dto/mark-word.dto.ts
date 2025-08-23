import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { UpdateProgressDto } from './update-progress';

export class MarkWordsLearnedDto {
  @ApiProperty({
    description: 'Масив ID слів для позначення як вивчені',
    type: [Number],
    example: [1, 2, 3, 4, 5],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  wordIds: number[];

  @ApiProperty({ description: 'Дані про прогрес' })
  @ValidateNested()
  @Type(() => UpdateProgressDto)
  progressData: UpdateProgressDto;
}
