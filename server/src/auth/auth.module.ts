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
import { GoogleStrategy } from './strategy/google.strategy';
import { GithubStrategy } from './strategy/github.strategy';
import { DatabaseService } from 'src/database/database.service';

@Module({
  imports: [
    ConfigModule, 
    UsersModule,
    JwtModule.register({}),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy,JwtRefreshStrategy,JwtRefreshGuard,GoogleStrategy,GithubStrategy,DatabaseService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule,JwtRefreshGuard,DatabaseService],
})
export class AuthModule {}
//