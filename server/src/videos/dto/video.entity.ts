import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { Role, Task } from 'generated/prisma/client';

export class VideoEntity {
  @ApiProperty()
  @IsUUID()
  id: number;

  @ApiProperty({ example: 'Introduction to Phrasal Verbs' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
  example: 'This video explains basic phrasal verbs.',
  required: false,
  })
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'https://www.youtube.com/watch?v=12345' })
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiProperty({ example: 'Beginner', required: false })
  @IsOptional()
  level?: string;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsOptional()
  tasks: Task;
}
