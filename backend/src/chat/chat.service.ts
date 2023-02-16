import { Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendChatDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async sendChat(dto: SendChatDto): Promise<Message> {
    return this.prisma.message.create({
      data: {
        user: {
          connect: { id: parseInt(dto.userId) },
        },
        message: dto.message,
      },
    });
  }
}
