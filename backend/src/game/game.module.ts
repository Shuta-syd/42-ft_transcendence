import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { PrismaModule } from '../prisma/prisma.module';
import { GameGateway } from './game.gateway';
import { PrismaService } from '../prisma/prisma.service';
import { MatchService } from 'src/match/match.service';
import { MatchModule } from 'src/match/match.module';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [MatchModule],
  controllers: [GameController],
  providers: [
    GameService,
    GameGateway,
    PrismaService,
    MatchService,
    JwtService,
    ConfigService,
  ],
  exports: [GameService],
})
export class GameModule {}
