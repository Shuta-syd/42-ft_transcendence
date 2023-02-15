import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.userGlobalPipes(new ValidationPipe({ whitelist: true }} )) //dto, validateで使用
  app.enableCors({
    origin: ['http://localhost:3000'], //許可したいfrontsideのURL
  });
  await app.listen(8080);
}
bootstrap();
