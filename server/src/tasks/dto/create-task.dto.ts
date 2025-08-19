import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { CEFRLevel,  CoreSkillType,  Language, TaskType } from "generated/prisma";

export class CreateTaskDto {
  @IsString()
  question: string;

  @IsString()
  answer: string;

  @IsArray()
  @IsString({ each: true })
  options: string[];

  @IsEnum(CoreSkillType)
  skillType: CoreSkillType;

  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsString()
  explanation?: string;


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

  
}