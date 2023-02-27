import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
  //最終的には個人のuserに対して、特定のgame result()
  // @Get()
  // async getMatch(
  //   @Param('match_id') match_id: Match,
  // ): Promise<string | null> {
  //   return this.matchService.getWinner(match_id);
  // }

  /* 全てのMatch情報を返す関数 */
  @Get()
  async getAllMatches(): Promise<Match[] | null> {
    return this.matchService.getAllMatches();
  }
}
