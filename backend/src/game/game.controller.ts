import { Body, Controller, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { Game } from '@prisma/client';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}
  @Post('newplayer')
  async setplayer(
    @Body() assignPlayerReqDto: string | any, // assignPlayerReq の型もしくは any を指定
  ): Promise<Game | null> {
    return this.gameService.handleAssignPlayerReq(assignPlayerReqDto);
  }
}
