import { Body, Controller, Get,Request, HttpCode, HttpStatus, Post, UseGuards, BadRequestException } from '@nestjs/common';
import { Prisma, User } from 'generated/prisma/client';
import { AuthService } from './auth.service';

import { UserEntity } from 'src/users/dto/user.entity';
import { Public } from './public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { AccessToken } from './types/AccessToken';

@Public()
@Controller('auth')
export class AuthController {
constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  signIn(@Request() req): Promise<AccessToken | BadRequestException> {
    return this.authService.signIn(req);
  }

  @Post('/registration')
  regsistration(@Body() regDto: Prisma.UserCreateInput) {
    return this.authService.registration(regDto);
  }

  @Get('/profile')
  getProfile(@Request() req) { 
    return req.user;
  }
}
