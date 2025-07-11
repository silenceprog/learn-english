import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtRefreshStrategy } from './strategy/jwt.refresh.strategy';
import { JwtRefreshGuard } from './jwt-refresh.guard';

@Module({
  imports: [
    ConfigModule, 
    UsersModule,
    JwtModule.register({}),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy,JwtRefreshStrategy,JwtRefreshGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtModule,JwtRefreshGuard],
})
export class AuthModule {}
//