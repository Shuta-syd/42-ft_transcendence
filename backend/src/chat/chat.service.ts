import { Injectable } from '@nestjs/common';
import { ChatRoom, Message } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendChatDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getChats(roomId: number): Promise<Message[] | null> {
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: { messages: true },
    });
    return chatRoom?.messages ?? null;
  }

  async crateChatRoom(): Promise<ChatRoom> {
    return this.prisma.chatRoom.create({
      data: {},
    });
  }

  async sendChat(dto: SendChatDto): Promise<Message> {
    return this.prisma.message.create({
      data: {
        user: {
          connect: { id: parseInt(dto.userId) },
        },
        room: {
          connect: { id: parseInt(dto.roomId) },
        },
        message: dto.message,
      },
    });
  }
}
