import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';
import 'winston-daily-rotate-file'; 
import { setupSwagger } from './swagger.config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    logger:WinstonModule.createLogger({
      transports:[
        new transports.DailyRotateFile({
          filename: `logs/%DATE%-error.log`, 
          level: 'error',
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false, 
          maxFiles: '30d', 
        }),
        new transports.DailyRotateFile({
          filename: `logs/%DATE%-combined.log`,
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxFiles: '30d',
        }),
        new transports.Console({
         format: format.combine(
           format.cli(),
           format.splat(),
           format.timestamp(),
           format.printf((info) => {
             return `${info.timestamp} ${info.level}: ${info.message}`;
           }),
          ),
      }),
      ],
    }),
  });

  app.enableCors({ 
    origin: ['http://localhost:3000', 'https://learn-english-chi-nine.vercel.app'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']});
  app.use(helmet());
  app.setGlobalPrefix('api')

  setupSwagger(app);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, 
    forbidNonWhitelisted: true, 
    transform: true, 
  }),);
  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
bootstrap();
