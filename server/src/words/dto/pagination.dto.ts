import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    example: '1',
    description: 'Кількість пропущених слів',
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
}
