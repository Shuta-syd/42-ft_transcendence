import { Injectable } from '@nestjs/common';
import { ChatRoom, Member, Message } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { ChatRoomPayload, CreateChatRoom, SendChatDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  /**
   * @returns 作成したChatRoomデータ
   */
  async crateChatRoom(userId: string, dto: CreateChatRoom): Promise<ChatRoom> {
    return this.prisma.chatRoom
      .create({
        data: {
          isDM: JSON.parse(dto.isDM),
          name: dto.name === undefined ? 'unknown' : dto.name,
        },
      })
      .then((room: ChatRoom): ChatRoom => {
        this.addMember(userId, room.id);
        return room;
      });
  }

  /**
   * @param roomId 取得したいroomのID
   * @returns 取得したRoomデータ
   */
  async getChatRoomById(roomId: string): Promise<ChatRoom> {
    return this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        members: { include: { user: true } },
      },
    });
  }

  /**
   * @param userId APIを叩いているユーザのID
   * @param roomId 所属するroomID
   */
  async getFriendNameByDMId(userId: string, roomId: string): Promise<string> {
    const members = await this.prisma.chatRoom
      .findUnique({
        where: { id: roomId },
      })
      .members();
    const friendMember = members.filter(
      (member: Member) => member.userId !== userId,
    );
    const friend = await this.userService.getUserById(friendMember[0].userId);
    return friend.name;
  }

  /**
   * @param userId APIを叩いているユーザのID
   * @param roomId 所属するroomID
   */
  async getMyMemberId(userId: string, roomId: string): Promise<string> {
    const members = await this.prisma.chatRoom
      .findUnique({
        where: { id: roomId },
      })
      .members();
    const userMember = members.filter(
      (member: Member) => member.userId === userId,
    );
    return userMember[0].id;
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
  async getUserDM(userId: string): Promise<ChatRoomPayload> {
    const DMRooms: ChatRoomPayload = {};
    const DirectMessageRooms = await this.prisma.chatRoom.findMany({
      where: {
        isDM: true,
        members: {
          some: {
            userId: userId,
          },
        },
      },
      include: { members: true },
    });

    DirectMessageRooms.map((room: ChatRoom & { members: Member[] }) => {
      room.members.map((member: Member) => {
        if (member.userId !== userId) DMRooms[member.userId] = room.id;
      });
    });
    return DMRooms;
  }

  /**
   * @param roomId 取得したいチャットルームのRoomId
   * @returns チャットルームのログ or null
   */
  async getChatLogByRoomId(roomId: string): Promise<Message[]> {
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: { messages: true },
    });
    return chatRoom?.messages;
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
        senderName: dto.senderName,
        message: dto.message,
      },
    });
  }

  /**
   * Channel service
   */
  /**
   * @param userId 所属しているuserId
   * @returns userが所属しているChannelを全て返す
   */
  async getChannels(userId: string): Promise<ChatRoom[]> {
    const channels = await this.prisma.chatRoom.findMany({
      where: {
        isDM: false,
        members: {
          some: {
            userId: userId,
          },
        },
      },
    });
    return channels;
  }
}
