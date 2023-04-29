import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import { Socket } from 'socket.io';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly appGateway: AppGateway,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('game/status/off')
  async InGameStatusOff(@Body() dto: { userId: string }) {
    return this.appGateway.inGameStatusOff(dto.userId);
  }
}
