import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Pong, Game, Match, InviteGame } from '@prisma/client';
@Injectable()
export class PongService {
  constructor(private prisma: PrismaService) {}

  async createGame(
    player1: string,
    player2: string,
    roomId: string,
  ): Promise<Pong | null> {
    return this.prisma.pong.create({
      data: {
        player1: player1,
        player2: player2,
        id: roomId,
      },
    });
  }
}
