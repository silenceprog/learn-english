import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsString } from "class-validator";
import { Language, Level, Purpose } from "generated/prisma";


export class CreateSettingDto {
   @ApiProperty({ example: 1, description: 'ID користувача' })
  @IsInt()
  userId: number;

  @ApiProperty({ enum: Language, example: Language.UA, description: 'Основна мова інтерфейсу' })
  @IsEnum(Language)
  global_language: Language;

  @ApiProperty({ enum: Language, example: Language.EN, description: 'Мова навчання' })
  @IsEnum(Language)
  curent_language: Language;

  @ApiProperty({ example: ['travel', 'work'], description: 'Цілі навчання' })
  @IsArray()
  @IsEnum(Purpose)
  purposes: Purpose;

  @ApiProperty({ example: 'A2', description: 'Поточний рівень володіння мовою' })
  @IsEnum(Level)
  current_level: Level;
}
