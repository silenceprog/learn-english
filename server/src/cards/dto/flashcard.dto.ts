import { IsString, IsBoolean, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { CEFRLevel, Language, MasteryLevel } from 'generated/prisma';

export class GetFlashcardsDto {
  @IsOptional()
  @IsEnum(Language)
  language?: Language;

  @IsOptional()
  @IsEnum(MasteryLevel)
  masteryLevel?: MasteryLevel;

  @IsOptional()
  @IsEnum(CEFRLevel)
  cefrLevel?: CEFRLevel;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  offset?: number;
}