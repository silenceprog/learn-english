import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Level, Purpose } from 'generated/prisma';
import { Strategy } from 'passport-github';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private databaseService: DatabaseService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: 'https://learn-english-chi-nine.vercel.app/github/redirect',
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ) {
    const { emails, username, photos } = profile;
    const email = emails[0].value;

    let user = await this.databaseService.user.findUnique({ where: { email } });

    

    if (!user) {

      user = await this.databaseService.user.create({
        data: {
          email,
          username,
          password: '',
          role: 'USER',
          isEmailVerified: true,
          provider: 'github',
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
