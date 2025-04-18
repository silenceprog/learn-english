import { Body, Controller, Get,Request, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('/registration')
  regsistration(@Body() regDto: Prisma.UserCreateInput) {
    return this.authService.registration(regDto);
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  getProfile(@Request() req) { 
    return req.user;
  }
}
