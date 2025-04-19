import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './dto/user.entity';
import { Prisma, Role } from 'generated/prisma/client';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  
  @ApiOperation({ summary: 'Створення користувача' })
  @ApiResponse({ status: 201, type: UserEntity })
  @Roles("OWNER")
  @UseGuards(RolesGuard)
  @Post()
  createUser(@Body() createUserDTO: Prisma.UserCreateInput) {
    return this.usersService.createUser(createUserDTO);
  }

  @ApiOperation({ summary: 'Отримання всіх користувачів' })
  @ApiResponse({ status: 200 })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Get()
  findAll(@Query('role') role?: Role) {
    return this.usersService.findAll(role);
  }


  @ApiOperation({ summary: 'Отримання користувача по емейлу' })
  @ApiResponse({ status: 200, type: UserEntity })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Get(':email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @ApiOperation({ summary: 'Отримання користувача по айді' })
  @ApiResponse({ status: 200, type: UserEntity })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  @ApiOperation({ summary: 'Оновлення інформації користувача' })
  @ApiResponse({ status: 200, type: UserEntity })
  @Roles("OWNER")
  @UseGuards(RolesGuard)
  @Patch(':id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ) {
    return this.usersService.updateUser(+id, updateUserDto);
  }

  @ApiOperation({ summary: 'Видалення користувача' })
  @ApiResponse({ status: 200 })
  @Roles("OWNER")
  @UseGuards(RolesGuard)
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(+id);
  }
}
