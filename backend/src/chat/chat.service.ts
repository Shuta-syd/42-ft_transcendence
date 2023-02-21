import { Injectable } from '@nestjs/common';
import { ChatRoom, Member, Message } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendChatDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  /**
   * @returns 作成したChatRoomデータ
   */
  async crateChatRoom(isDM: boolean): Promise<ChatRoom> {
    return this.prisma.chatRoom.create({
      data: {},
    });
  }

  /**
   * @param userId 所属させたいuserID
   * @param roomId 所属させたいChat RoomID
   * @returns 作成したMember object
   */
  async addMember(userId: string, roomId: string): Promise<Member> {
    return this.prisma.member.create({
      data: {
        room: {
          connect: {
            id: roomId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  /**
   * @param userId 取得したいDMのuserID
   * @returns userIDのすべてのDM
   */
  async getUserDM(userId: string): Promise<ChatRoom[]> {
    const DirectMessageRooms = this.prisma.chatRoom.findMany({
      where: {
        isDM: true,
        members: {
          some: {
            userId: userId,
          },
        },
      },
    });
    return DirectMessageRooms;
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
          connect: { id: dto.memberId },
        },
        room: {
          connect: { id: roomId },
        },
        message: dto.message,
      },
    });
  }
}
