import { Body, Controller, Get, Post } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchDto } from './dto/match.dto';
import { Match } from '@prisma/client';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  // accessor
  @Post()
  async setMatch(@Body() matchData: MatchDto): Promise<Match | null> {
    return this.matchService.createMatch(matchData);
  }

  /* 全てのMatch情報を返す関数 */
  @Get()
  async getAllMatches(): Promise<Match[] | null> {
    return this.matchService.getAllMatches();
  }
}
