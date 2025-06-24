import {
  Body,
  Controller,
  Get,
  Request,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { AccessToken } from './types/AccessToken';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({summary:"Вхід користувача"})
  @ApiResponse({status:200, type: LoginUserDto})
  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  login(@Body() userDto: LoginUserDto): Promise<AccessToken | BadRequestException> {
    return this.authService.login(userDto);
  }

  @ApiOperation({summary:"Регістрація користувача"})
  @ApiResponse({status:200, type: CreateUserDto})
  @Post('/registration')
  regsistration(@Body() regDto: CreateUserDto) {
    return this.authService.registration(regDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
