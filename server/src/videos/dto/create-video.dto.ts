import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from "class-validator";
import { CEFRLevel, CoreSkillType, Language } from "generated/prisma";

export class CreateVideoDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  url: string;

  @IsOptional()
  @IsEnum(Language)
  language?: Language;

  @IsOptional()
  @IsEnum(CEFRLevel)
  level?: CEFRLevel;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(CoreSkillType, { each: true })
  skillTypes?: CoreSkillType[];

  @IsOptional()
  @IsNumber()
  courseId?: number;
}