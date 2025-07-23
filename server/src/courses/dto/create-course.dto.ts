import { IsString, IsOptional, IsEnum, IsBoolean, IsArray, IsNumber } from 'class-validator';
import { CEFRLevel, CoreSkillType, Level } from 'generated/prisma';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsEnum(CEFRLevel)
  level?: CEFRLevel;

  @IsOptional()
  @IsArray()
  @IsEnum(CoreSkillType, { each: true })
  targetSkills?: CoreSkillType[];

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsNumber()
  estimatedHours?: number;

  @IsOptional()
  @IsNumber()
  totalXP?: number;

  @IsOptional()
  @IsNumber()
  authorId?: number;
}