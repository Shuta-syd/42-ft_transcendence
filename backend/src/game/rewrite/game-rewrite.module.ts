import { Module } from '@nestjs/common';
import { MatchModule } from 'src/match/match.module';
import { GameReWriteService } from './game-rewrite.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MatchService } from 'src/match/match.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GameReWriteController } from './game-rewrite.controller';
import { GameReWriteGateway } from './game-rewrite.gateway';

@Module({
  imports: [MatchModule],
  controllers: [GameReWriteController],
  providers: [
    GameReWriteGateway,
    GameReWriteService,
    PrismaService,
    MatchService,
    JwtService,
    ConfigService,
  ],
})
export class GameReWriteModule {}
