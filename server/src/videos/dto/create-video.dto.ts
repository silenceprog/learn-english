import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsUrl } from "class-validator";

export class CreateVideoDto {
    @ApiProperty({ example: 'Introduction to Phrasal Verbs' })
    @IsNotEmpty()
    title: string;
  
    @ApiProperty({ example: 'This video explains basic phrasal verbs.', required: false })
    @IsOptional()
    description?: string;
  
    @ApiProperty({ example: 'https://www.youtube.com/watch?v=12345' })
    @IsNotEmpty()
    @IsUrl()
    url: string;
  
    @ApiProperty({ example: 'Beginner', required: false })
    @IsOptional()
    level?: string;
  }