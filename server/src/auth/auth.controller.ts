import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { GetCurrentUserId } from 'src/decorators/get-current-user-id.decorator';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { Tokens } from './types/Tokens';
import { Throttle } from '@nestjs/throttler';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Throttle({ short: { limit: 2, ttl: 1000 }, long: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Вхід користувача' })
  @ApiResponse({ status: 200, type: LoginUserDto })
  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  login(@Body() userDto: LoginUserDto): Promise<Tokens | BadRequestException> {
    return this.authService.login(userDto);
  }

  @ApiOperation({ summary: 'Регістрація користувача' })
  @ApiResponse({ status: 200, type: CreateUserDto })
  @Post('/registration')
  regsistration(@Body() regDto: CreateUserDto) {
    return this.authService.registration(regDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Вихід користувача' })
  @ApiResponse({ status: 200, description: 'Користувач успішно вийшов' })
  async logout(@GetCurrentUserId() userId: number) {
    return this.authService.logout(userId);
  }

  @Throttle({
    short: { limit: 1, ttl: 1000 },
    long: { limit: 2, ttl: 60000 },
  })
  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Відновлення токенів' })
  @ApiResponse({ status: 200, description: 'Токени успішно відновлені' })
  async refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  getProfile(@GetCurrentUser() user,@Res({ passthrough: true }) res: Response) {
    return user;
  }
}
