import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    ChatModule,
    PrismaModule,
    UserModule,
    MatchModule,
    AuthModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, AppGateway],
})
export class AppModule {}
