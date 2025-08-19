import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from 'generated/prisma/client';


export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'username123' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123' })
  @MinLength(8)
  password: string;

  @ApiProperty({ enum: Role, default: Role.USER })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiProperty({ example: 'false',default:false })
  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @ApiProperty({default: "none"})
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({example: "google"})
  @IsString()
  @IsOptional()
  provider?: string
}