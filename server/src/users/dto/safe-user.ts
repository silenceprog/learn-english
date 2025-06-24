import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Role } from 'generated/prisma/client';


export class SafeUser {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'username123' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ enum: Role, default: Role.USER })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}