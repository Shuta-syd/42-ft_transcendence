import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { GameService } from './game.service';
import { Game, InviteGame } from '@prisma/client';
import { assignGuestDto, assignObserverDto } from './dto/game.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}
  @Post('newplayer')
  async setplayer(@Body() dto: { playerName: string }): Promise<Game> {
    return this.gameService.handleAssignPlayerReq(dto.playerName);
  }

  @Get('ongoing')
  async getOngoingGames(): Promise<Game[] | null> {
    return this.gameService.getAllOngoingGames();
  }

  @Post('newobserver')
  async setNewObserver(
    @Body() dto: assignObserverDto | any,
  ): Promise<Game | null> {
    return this.gameService.assignObserver(dto);
  }
  @Get('observer')
  async getObserverGameinfo(@Param() name: string | any): Promise<Game | null> {
    return this.gameService.getObserverGame(name);
  }

  @Post('create_invite_room')
  async sethost(
    @Body() assignPlayerReqDto: string | any,
  ): Promise<InviteGame | null> {
    return this.gameService.createInviteGame(assignPlayerReqDto);
  }

  @Post('invited_guest')
  async setguest(
    @Body() assignPlayerReqDto: assignGuestDto | any,
  ): Promise<InviteGame | null> {
    return this.gameService.assignGuest(assignPlayerReqDto);
  }
}
