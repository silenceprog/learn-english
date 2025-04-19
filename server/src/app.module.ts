import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/jwt.guard';

@Module({
  imports: [UsersModule, AuthModule, DatabaseModule,
    ThrottlerModule.forRoot([{
    name: 'short',
    ttl: 1000,
    limit: 3,
  },
   {
    name: 'medium',
    ttl: 10000,
    limit: 20
  },
  {
    name: 'long',
    ttl: 60000,
    limit: 100,
  }]),],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: JwtGuard,
  },{
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }],
})
export class AppModule {}
