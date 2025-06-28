import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Language } from "generated/prisma";

export class CreateWordDto {
  @ApiProperty({ example: 'apple', description: 'Слово англійською або іншою мовою' })
  @IsString()
  text: string;

  @ApiProperty({ enum: Language, example: Language.EN, description: 'Мова слова' })
  @IsEnum(Language)
  language: Language;

  @ApiProperty({ example: ['яблуко'], description: 'Переклад слова', type: [String] })
  @IsArray()
  translate: string[];

  @ApiProperty({ example: ['a round fruit with shiny red or green skin that is fairly hard and white inside'], description: 'Значення слова', type: [String] })
  @IsArray()
  meaning: string[];

  @ApiProperty({ example: 'I ate an apple in the morning.', description: 'Приклад використання', required: false })
  @IsOptional()
  @IsString()
  example?: string;

  @ApiProperty({ example: 'noun', description: 'Частина мови', required: false })
  @IsOptional()
  @IsString()
  partOfSpeech?: string;
  }