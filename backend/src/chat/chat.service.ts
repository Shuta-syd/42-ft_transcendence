import { Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendChatDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async sendChat(userId: number, dto: SendChatDto): Promise<Message> {
    return this.prisma.message.create({
      data: {
        userId,
        ...dto,
      },
    });
  }
}
