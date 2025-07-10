import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class EmailSendDTO {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  to: string;

  @IsString()
  subject: string;
  
  @IsString()
  html: string;

}
