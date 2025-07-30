import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class WordResult {
  @ApiProperty({ description: 'ID слова' })
  @Type(() => Number)
  @IsInt()
  wordId: number;
  @ApiProperty({ description: 'Слово' })
  word: string;
  @ApiProperty({ description: 'Причина помилки' })
  reason?: string;
}
