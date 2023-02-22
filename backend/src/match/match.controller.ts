import { Body, Controller, Post } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchDto } from './dto/match.dto';
import { Match } from '@prisma/client';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}
  // accessor
  @Post()
  async createMatch(@Body() matchData: MatchDto): Promise<Match | null> {
    return this.matchService.createMatch(matchData);
  }
}
