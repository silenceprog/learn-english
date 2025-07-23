import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CEFRLevel, CoreSkillType, Language, TaskType } from "generated/prisma";

export class CreateTaskDto {
  @IsString()
  question: string;

  @IsString()
  answer: string;

  @IsArray()
  @IsString({ each: true })
  options: string[];

  @IsOptional()
  @IsEnum(TaskType)
  type?: TaskType;

  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsEnum(CoreSkillType)
  skillType: CoreSkillType;

  @IsOptional()
  @IsEnum(Language)
  language?: Language;

  @IsOptional()
  @IsEnum(CEFRLevel)
  cefrLevel?: CEFRLevel;

  @IsOptional()
  @IsNumber()
  xpReward?: number;

  @IsOptional()
  @IsNumber()
  timeLimit?: number;

  @IsOptional()
  @IsNumber()
  authorId?: number;

  
}