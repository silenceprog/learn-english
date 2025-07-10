import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class EmailSend {
  @ApiProperty({ example: 'forward@gmail.com' })
  @IsEmail()
  email: string;
}
