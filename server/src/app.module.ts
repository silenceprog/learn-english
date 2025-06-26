import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/jwt.guard';
import { RolesGuard } from './roles/roles.guard';
import { VideosModule } from './videos/videos.module';
import { TasksModule } from './tasks/tasks.module';
import { WordsModule } from './words/words.module';
import { JwtStrategy } from './auth/strategy/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { EmailModule } from './auth/email/email.module';
import { CoursesModule } from './courses/courses.module';
import { EmailController } from './auth/email/email.controller';
import { SettingsModule } from './settings/settings.module';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';
import { TranslateModule } from './translate/translate.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from './app-options';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({RedisOptions,ttl:60*60}),
    UsersModule,
    AuthModule,
    DatabaseModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    VideosModule,
    TasksModule,
    WordsModule,
    AdminModule,
    EmailModule,
    CoursesModule,
    SettingsModule,
    TranslateModule,
  ],
  controllers: [AppController, EmailController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR, 
      useClass: CacheInterceptor,
    },
    JwtStrategy,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .exclude(
        { path: 'admin/users', method: RequestMethod.DELETE },
      )
      .forRoutes('*');
  }
}
