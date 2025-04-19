import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
      .setTitle('English Learn App')
      .setDescription('Документація RestAPI')
      .setVersion('1.0.0')
      .build()
  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('/api/docs',app,document)


  app.enableCors()
  app.setGlobalPrefix('api')
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
