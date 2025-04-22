import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './dto/user.entity';
import { Role } from 'generated/prisma/client';
import { Roles } from 'src/roles/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @ApiOperation({ summary: 'Створення користувача' })
  @ApiResponse({ status: 201, type: CreateUserDto })
  @Roles(Role.OWNER)
  @Post()
  createUser(@Body() createUserDTO: CreateUserDto) {
    return this.usersService.createUser(createUserDTO);
  }

  @ApiOperation({ summary: 'Отримання всіх користувачів' })
  @ApiResponse({ status: 200, type: UserEntity })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: Role,
    description: 'Фільтрація за роллю',
  })
  @Roles(Role.ADMIN)
  @Get()
  findAll(@Query('role') role?: Role) {
    return this.usersService.findAll(role);
  }


  @ApiOperation({ summary: 'Отримання користувача по емейлу' })
  @ApiResponse({ status: 200, type: UserEntity})
  @Roles(Role.ADMIN)
  @Get(':email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @ApiOperation({ summary: 'Отримання користувача по айді' })
  @ApiResponse({ status: 200, type: UserEntity })
  @Roles(Role.ADMIN)
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  @ApiOperation({ summary: 'Оновлення інформації користувача' })
  @ApiResponse({ status: 200, type: UpdateUserDto })
  @Roles(Role.OWNER)
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Видалення користувача' })
  @ApiResponse({ status: 200 })
  @Roles(Role.OWNER)
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
