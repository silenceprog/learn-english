import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { TaskType } from 'generated/prisma/client';

export class TaskEntity {
  @ApiProperty()
  @IsUUID()
  id: number;

  @ApiProperty({ example: 'What is the correct meaning of "get up"?' })
  @IsNotEmpty()
  question: string;

  @ApiProperty({ example: 'to wake up and get out of bed' })
  @IsNotEmpty()
  answer: string;

  @ApiProperty({
  example: ['to lie down', 'to get out of bed', 'to sit'],
  type: [String],
  })
  @IsArray()
  options: string[];

  @ApiProperty({ enum: TaskType, default: TaskType.FLASHCARDS })
  @IsEnum(TaskType)
  type: TaskType;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  videoId?: number;

  @ApiProperty()
  @IsDate()
  createdAt: Date;
}
