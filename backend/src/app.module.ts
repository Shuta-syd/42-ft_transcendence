import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { MatchModule } from './match/match.module';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { AppGateway } from './app.gateway';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UTF8Middleware } from './midlleware/utf-8.middleware';

@Module({
  imports: [
    ChatModule,
    PrismaModule,
    UserModule,
    MatchModule,
    AuthModule,
    GameModule,
    JwtModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, AppGateway, ConfigService, JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UTF8Middleware).forRoutes('*');
  }
}
