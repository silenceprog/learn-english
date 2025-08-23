import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";

export class CreateWordDto {
  @ApiProperty({ example: 'apple', description: 'Слово англійською або іншою мовою' })
  @IsString()
  text: string;

  @ApiProperty({ example: ['яблуко'], description: 'Переклад слова', type: [String], required: false })
  @IsOptional()
  @IsArray()
  translate: string[];

  @ApiProperty({ example: 'noun', description: 'Частина мови', required: false })
  @IsOptional()
  @IsString()
  partOfSpeech?: string;

  @ApiProperty({ example: ['a round fruit'], description: 'Визначення слова', type: [String], required: false })
  @IsOptional()
  @IsArray()
  definitions?: string[];

  @ApiProperty({ example: ['fruit'], description: 'Синоніми', type: [String], required: false })
  @IsOptional()
  @IsArray()
  synonyms?: string[];

  @ApiProperty({ example: [], description: 'Антоніми', type: [String], required: false })
  @IsOptional()
  @IsArray()
  antonyms?: string[];

  @ApiProperty({ example: ['I ate an apple in the morning.', 'She bought a red apple.'], description: 'Приклади використання', type: [String], required: false })
  @IsOptional()
  @IsArray()
  examples?: string[];
}