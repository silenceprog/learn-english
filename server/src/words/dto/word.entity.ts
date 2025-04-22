import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class WordEntity {
  @ApiProperty()
  @IsUUID()
  id: number;

  @ApiProperty({ example: 'apple' })
  @IsNotEmpty()
  text: string;

  @ApiProperty({ example: 'яблуко' })
  @IsNotEmpty()
  meaning: string;

  @ApiProperty({ example: 'He ate an apple every morning.', required: false })
  @IsOptional()
  example?: string;

  @ApiProperty()
  @IsDate()
  createdAt: Date;
}
