import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';
import { AccessTokenPayload } from '../types/AccessTokenPayload';


@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
  ) {
      const secret = configService.get<string>('JWT_REFRESH_TOKEN');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
     super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: AccessTokenPayload) {
    const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim();
    
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token malformed');
    }

    const user = await this.userService.findById(payload.id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      ...user,
      refreshToken,
    };
  }
}