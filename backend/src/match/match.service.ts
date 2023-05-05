import { Injectable } from '@nestjs/common';
import { MatchDto } from './dto/match.dto';
import { Match } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatchService {
  constructor(private prisma: PrismaService) {}

  async createMatch(dto: MatchDto): Promise<Match | null> {
    if (!dto.roomId) {
      return null;
    }
    return this.prisma.match.create({
      data: {
        player1: dto.player1,
        player2: dto.player2,
        winner_id: parseInt(dto.winner_id, 10),
        roomId: dto.roomId,
      },
    });
  }

  async getAllMatches(): Promise<Match[] | null> {
    return await this.prisma.match.findMany({});
  }
}
