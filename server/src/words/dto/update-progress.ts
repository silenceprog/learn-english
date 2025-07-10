import { ApiProperty } from "@nestjs/swagger";
import {  IsBoolean, IsNumber } from "class-validator";

export class UpdateProgressDto {
  @ApiProperty({ example: true, description: 'Виконаність завдання' })
  @IsBoolean()
  isPassed: boolean;

  @ApiProperty({ example: 30, description: 'Рахунок слова' })
  @IsNumber()
  score: number;
  }