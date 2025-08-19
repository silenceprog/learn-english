import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    example: '1',
    description: 'Кількість сторінок',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number;

  @ApiProperty({
    example: '10',
    description: 'Ліміт слів на сторінці',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit?: number;

  @IsOptional()
  @IsIn(['ALL','LEARNED', 'LEARNING'])
  type?: 'ALL' | 'LEARNED' | 'LEARNING';
}
