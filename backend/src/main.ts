import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('ft_transcendence')
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, swaggerDocument);

  //app.userGlobalPipes(new ValidationPipe({ whitelist: true }} )) //dto, validateで使用
  app.enableCors({
    origin: ['http://localhost:3000'], //許可したいfrontsideのURL
  });
  await app.listen(8080);
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app); // prismaをnestjsを終了する前に正常終了するための処理
}
bootstrap();
