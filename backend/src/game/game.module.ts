import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { PrismaModule } from '../prisma/prisma.module';
import { GameGateway } from './game.gateway';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [GameController],
  providers: [GameService, GameGateway, PrismaService],
  exports: [GameService],
})
export class GameModule {}
