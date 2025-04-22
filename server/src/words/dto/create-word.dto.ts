import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateWordDto {
    @ApiProperty({ example: 'apple' })
    @IsNotEmpty()
    text: string;
  
    @ApiProperty({ example: 'яблуко' })
    @IsNotEmpty()
    meaning: string;
  
    @ApiProperty({ example: 'He ate an apple every morning.', required: false })
    @IsOptional()
    example?: string;
  }