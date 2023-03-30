import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('ft_transcendence')
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, swaggerDocument);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3000'], //許可したいfrontsideのURL
  });
  app.use(cookieParser());
  await app.listen(8080);
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app); // prismaをnestjsを終了する前に正常終了するための処理
}
bootstrap();
