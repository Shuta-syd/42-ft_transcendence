import { Injectable } from '@nestjs/common';
import { MatchDto } from './dto/match.dto';
import { Match } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatchService {
  constructor(private prisma: PrismaService) {}

  async createMatch(data: MatchDto): Promise<Match | null> {
    return this.prisma.match.create({
      data,
    });
  }
}
