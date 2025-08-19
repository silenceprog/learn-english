import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum } from "class-validator";
import { CEFRLevel, Language, Purpose } from "generated/prisma";


export class CreateSettingDto {
  @ApiProperty({ enum: Language, example: Language.UA, description: 'Основна мова інтерфейсу' })
  @IsEnum(Language)
  global_language: Language;

  @ApiProperty({ enum: Language, example: Language.EN, description: 'Мова навчання' })
  @IsEnum(Language)
  current_language: Language;

  @ApiProperty({ example: ['TRAVEL', 'WORK'], description: 'Цілі навчання',enum:Purpose })
  @IsArray()
  @IsEnum(Purpose, { each: true })
  purposes: Purpose[];

  @ApiProperty({ example: 'A2', description: 'Поточний рівень володіння мовою' })
  @IsEnum( CEFRLevel)
  current_level: CEFRLevel;
}
