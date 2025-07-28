import { IsEnum, IsOptional, IsString } from "class-validator";
import { Language } from "generated/prisma";

export class CreateFlashcardDto {
  @IsString()
  word: string;

  @IsString()
  translation: string;

  @IsOptional()
  @IsString()
  definition?: string;

  @IsEnum(Language)
  language: Language;
}