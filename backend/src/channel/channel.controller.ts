import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatRoom } from '@prisma/client';
import { Request } from 'express';
import { ChannelService } from './channel.service';

@Controller('channel')
@ApiTags('channel')
@UseGuards(AuthGuard('jwt'))
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get('')
  @ApiOperation({
    description: 'get channel user belongs to',
    summary: 'get channel user belongs to',
  })
  async getChannels(@Req() req: Request): Promise<ChatRoom[]> {
    return this.channelService.getChannels(req.user.id);
  }
}
