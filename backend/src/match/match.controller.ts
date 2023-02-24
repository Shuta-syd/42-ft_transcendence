import { Body, Controller, Get, Param, Post} from '@nestjs/common';
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
  @Get()
  async getMatch(@Param('matchId') matchId: string): Promise<string | null> {
    return this.matchService.getWinner(matchId);
  }
}
