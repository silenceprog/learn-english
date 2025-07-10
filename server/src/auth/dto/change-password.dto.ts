import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class ChangePassword {
  @ApiProperty({ example: 'password123' })
  @MinLength(8)
  oldPassword: string;
  @ApiProperty({ example: 'password123' })
  @MinLength(8)
  newPassword: string;
}
