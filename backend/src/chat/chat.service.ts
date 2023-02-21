import { Injectable } from '@nestjs/common';
import { ChatRoom, Message } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendChatDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  /**
   * @returns 作成したChatRoomデータ
   */
  async crateChatRoom(): Promise<ChatRoom> {
    return this.prisma.chatRoom.create({
      data: {},
    });
  }

  /**
   * @param roomId 取得したいチャットルームのRoomId
   * @returns チャットルームのログ or null
   */
  async getChatLogByRoomId(roomId: string): Promise<Message[] | null> {
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: { messages: true },
    });
    return chatRoom?.messages || null;
  }

  /**
   * @param roomId メッセージ送信先のroomId
   * @param dto メッセージ送信に必要なSendChatDto
   * @returns 送ったメッセージのデータ
   */
  async sendChat(roomId: string, dto: SendChatDto): Promise<Message> {
    return this.prisma.message.create({
      data: {
        member: {
          connect: { id: dto.userId },
        },
        room: {
          connect: { id: roomId },
        },
        message: dto.message,
      },
    });
  }
}
