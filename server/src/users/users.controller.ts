import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './dto/user.entity';
import { Prisma, Role } from 'generated/prisma/client';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Створення користувача' })
  @ApiResponse({ status: 201, type: UserEntity })
  @Post()
  createUser(@Body() createUserDTO: Prisma.UserCreateInput) {
    return this.usersService.createUser(createUserDTO);
  }

  @ApiOperation({ summary: 'Отримання всіх користувачів' })
  @ApiResponse({ status: 200 })
  @Get()
  findAll(@Query('role') role?: Role) {
    return this.usersService.findAll(role);
  }

  @ApiOperation({ summary: 'Отримання користувача по емейлу' })
  @ApiResponse({ status: 200, type: UserEntity })
  @Get(':email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @ApiOperation({ summary: 'Оновлення інформації користувача' })
  @ApiResponse({ status: 200, type: UserEntity })
  @Patch(':id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ) {
    return this.usersService.updateUser(+id, updateUserDto);
  }

  @ApiOperation({ summary: 'Видалення користувача' })
  @ApiResponse({ status: 200 })
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(+id);
  }
}
