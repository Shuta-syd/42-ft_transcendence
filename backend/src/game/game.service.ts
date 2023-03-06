import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { assignPlayerReq } from './dto/game.dto';
import { Game } from '@prisma/client';

let playerId = 0;
let tmpGame: Game;

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}
  async handleAssignPlayerReq(dto: assignPlayerReq): Promise<Game | null> {
    playerId += 1;
    // player id is odd number then create new game
    if (playerId % 2 != 0) {
      const game = this.prisma.game.create({
        data: {
          player1: dto.playerName,
          player2: '',
        },
      });
      // ここの処理は改善できそう
      tmpGame = await game;
      return game;
    } else {
      return this.prisma.game.update({
        where: {
          id: tmpGame.id,
        },
        data: {
          player2: dto.playerName,
        },
      });
    }
  }
}
