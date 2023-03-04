import { Body, Controller, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { assignPlayerReq, assignPlayerRes } from './dto/game.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}
  @Post('newplayer')
  async setplayer(
    @Body assignPlayerReqDto: assignPlayerReq,
  ): Promise<assignPlayerRes | null> {
    return ;
  }
}
