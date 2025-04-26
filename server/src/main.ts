import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors()
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
