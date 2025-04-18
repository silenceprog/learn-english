import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserEntity } from 'src/users/dto/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(UserEntity): Promise<UserEntity> {
    const user = await this.authService.validateUser(UserEntity);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}