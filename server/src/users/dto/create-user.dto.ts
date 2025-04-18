import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'generated/prisma/client';


export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'username123' })
  username: string;

  @ApiProperty({ example: 'password123' })
  password: string;

  @ApiProperty({ enum: Role, default: Role.USER })
  role?: Role;
}