import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';
import 'winston-daily-rotate-file'; 

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
    origin: [ 'https://learn-english-chi-nine.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']});
  app.use(helmet());
  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
      .setTitle('English Learn App')
      .setDescription('Документація RestAPI')
      .setVersion('1.0.0')
      .addBearerAuth( 
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          description: 'Введіть JWT токен, отриманий після входу',
          in: 'header',
        },
        'access-token', 
      )
      .build()
  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('/api/docs',app,document)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, 
    forbidNonWhitelisted: true, 
    transform: true, 
  }),);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
