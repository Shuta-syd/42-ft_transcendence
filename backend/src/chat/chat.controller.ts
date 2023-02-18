import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ChatRoom, Message } from '@prisma/client';
import { Request } from 'express';
import { ChatService } from './chat.service';
import { SendChatDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post(':id')
  async sendChat(
    // @Req() req: Request, jwt or passport使用する場合
    @Param('id') roomId: string,
    @Body() dto: SendChatDto,
  ): Promise<Message> {
    return this.chatService.sendChat(roomId, dto);
  }

  @Post('room')
  async createRoom(): Promise<ChatRoom> {
    return this.chatService.crateChatRoom();
  }

  @Get('room/:id')
  async getChats(@Param('id') id: string): Promise<Message[] | null> {
    return this.chatService.getChats(parseInt(id));
  }
}
