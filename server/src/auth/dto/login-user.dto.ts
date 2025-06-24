import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MinLength } from "class-validator";

export class LoginUserDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;
    @ApiProperty({ example: 'password123' })
    @MinLength(8)
    password: string;
  }