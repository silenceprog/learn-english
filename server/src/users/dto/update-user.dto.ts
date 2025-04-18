import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from 'generated/prisma/client';


export class UpdateUserDto {
  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  username?: string;

  @ApiPropertyOptional()
  password?: string;

  @ApiPropertyOptional({ enum: Role })
  role?: Role;

  @ApiPropertyOptional()
  isActive?: boolean;
}