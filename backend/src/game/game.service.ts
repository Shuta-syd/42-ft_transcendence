import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { assignPlayerReq, assignPlayerRes } from './dto/game.dto';
import { Game } from '@prisma/client';
let playerId = 0;


@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}
  async handleAssignPlayerReq(dto: assignPlayerReq): Promise<Game | null> {
    playerId += 1;
    // player id is odd number then create new game
    if (playerId % 2 != 0) {
      return this.prisma.game.create({
        data: {
          player1: dto.playerName,
          player2: '',
        },
      });
    } else {
      return this.prisma.game.
    }
  }
}
