import { IsBoolean, IsEnum, IsNumber, IsString } from "class-validator";
import { Language } from "generated/prisma";

export class FlashcardAnswerDto {
  @IsString()
  wordId: string;

  @IsString()
  answer: string;

  @IsBoolean()
  isCorrect: boolean;

  @IsNumber()
  responseTime: number; // в мілісекундах

  @IsEnum(Language)
  language: Language;
}