import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { TaskType } from "generated/prisma";

export class CreateTaskDto {
    @ApiProperty({ example: 'What is the correct meaning of "get up"?' })
    @IsNotEmpty()
    question: string;
  
    @ApiProperty({ example: 'to wake up and get out of bed' })
    @IsNotEmpty()
    answer: string;
  
    @ApiProperty({ example: ['to lie down', 'to get out of bed', 'to sit'], type: [String] })
    @IsArray()
    options: string[];
  
    @ApiProperty({ enum: TaskType, default: TaskType.MULTIPLE_CHOICE })
    @IsEnum(TaskType)
    type: TaskType;
  
    @ApiProperty({ example: 1, required: false })
    @IsOptional()
    videoId?: number;
  }