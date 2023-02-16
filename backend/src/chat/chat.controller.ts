import { Body, Controller, Post, Req } from '@nestjs/common';
import { Message } from '@prisma/client';
import { Request } from 'express';
import { ChatService } from './chat.service';
import { SendChatDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async sendChat(
    // @Req() req: Request, jwt or passport使用する場合
    @Body() userId: number,
    dto: SendChatDto,
  ): Promise<Message> {
    return this.chatService.sendChat(userId, dto);
  }
}
