import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Level, Purpose } from 'generated/prisma';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private databaseService: DatabaseService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'https://learn-english-chi-nine.vercel.app/google/redirect',
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { emails, displayName, photos } = profile;
    const email = emails[0].value;

    let user = await this.databaseService.user.findUnique({ where: { email } });
    const baseUsername =
      displayName?.replace(/\s+/g, '').toLowerCase() || 'user';
    let username = baseUsername;

    if (!user) {
      let counter = 1;

      while (
        await this.databaseService.user.findUnique({ where: { username } })
      ) {
        username = `${baseUsername}${counter++}`;
      }

      user = await this.databaseService.user.create({
        data: {
          email,
          username: username,
          password: '',
          role: 'USER',
          isEmailVerified: true,
          provider: 'google',
          avatar: photos?.[0]?.value,
          setting: {
            create: {
              global_language: 'UA',
              current_language: 'EN',
              purposes: [Purpose.NONE],
              current_level: Level.NONE,
            },
          },
        },
      });
    } else {
      user = await this.databaseService.user.update({
        where: { id: user.id },
        data: {
          username,
          avatar: profile.avatar,
        },
      });
    }

    done(null, user);

    return user;
  }
}
