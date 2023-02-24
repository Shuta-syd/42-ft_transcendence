import { Injectable } from '@nestjs/common';
import { MatchDto } from './dto/match.dto';
import { Match } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatchService {
  constructor(private prisma: PrismaService) {}

  async createMatch(dto: MatchDto): Promise<Match | null> {
    return this.prisma.match.create({
      data: {
        player1: dto.player1,
        player2: dto.player2,
        winner_id: parseInt(dto.winner_id, 10),
      },
    });
  }

  async getWinner(id: string): Promise<string | null> {
    if (id == '1') {
      return '1';
    } else {
      return '2';
    }
  }
}