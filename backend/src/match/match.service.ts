import { Injectable } from '@nestjs/common';
import { MatchDto } from './dto/match.dto';
import { InviteGame, Match, Game } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class MatchService {
  constructor(private prisma: PrismaService) {}

  async createMatch(dto: MatchDto): Promise<Match | null> {
    let roomId: string;
    let inviteGame: InviteGame;

    const game: Game = await this.prisma.game.findUnique({
      where: {
        player1: dto.player1,
        // player2: dto.player2,
      },
    });
    if (game && game.onGoing) {
      //gameに入っている場合
      roomId = game.id.toString();
    } else {
      //gameに入ってない場合
      //inviteGameに入っているか確認
      inviteGame = await this.prisma.inviteGame.findUnique({
        where: {
          player1: dto.player1,
          // player2: dto.player2,
        },
      });
      if (!game) {
        //inviteGameにもGameにも入っていない場合
        throw new NotFoundException();
      }
      roomId = inviteGame.id;
    }

    const isRoomId = await this.prisma.match.findUnique({
      where: {
        roomId: roomId,
      },
    });

    if (isRoomId) {
      return;
    }
    return this.prisma.match.create({
      data: {
        player1: dto.player1,
        player2: dto.player2,
        winner_id: parseInt(dto.winner_id, 10),
        roomId: roomId,
      },
    });
  }

  async getAllMatches(): Promise<Match[] | null> {
    return await this.prisma.match.findMany({});
  }
}
