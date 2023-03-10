import { Injectable } from '@nestjs/common';
import { ChatRoom, Member, MemberRole, Message } from '@prisma/client';
import { Msg } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import {
  ChatRoomPayload,
  CreateChatRoom,
  MemberDto,
  SendChatDto,
} from './dto/chat.dto';

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
          type: dto.type,
          password: dto.password,
          name: dto.name === undefined ? 'unknown' : dto.name,
        },
      })
      .then((room: ChatRoom): ChatRoom => {
        this.addMember(userId, room.id, 'OWNER');
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
  async getMyMember(userId: string, roomId: string): Promise<Member> {
    const members = await this.prisma.chatRoom
      .findUnique({
        where: { id: roomId },
      })
      .members();
    const userMember = members.filter(
      (member: Member) => member.userId === userId,
    );
    return userMember[0];
  }

  /**
   * @param userId 所属させたいuserID
   * @param roomId 所属させたいChat RoomID
   * @returns 作成したMember object
   */
  async addMember(
    userId: string,
    roomId: string,
    status: MemberRole,
  ): Promise<Member> {
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
        role: status,
      },
      include: {
        user: true,
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
        type: 'DM',
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
  async sendChat(
    userId: string,
    roomId: string,
    dto: SendChatDto,
  ): Promise<Message> {
    const member = await this.getMyMember(userId, roomId);
    if (member.isMute === true) throw new Error('You are not right');

    return this.prisma.message.create({
      data: {
        member: {
          connect: { id: member.id },
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
        NOT: [
          {
            type: 'DM',
          },
        ],
        members: {
          some: {
            userId: userId,
          },
        },
      },
    });
    return channels;
  }

  /**
   * @description 特定のメンバーをMuteもしくはunMuteにする（Owner or Adminのみ）
   */
  async muteMember(userId: string, dto: MemberDto): Promise<Msg> {
    const { roomId, memberId, status } = dto;
    const executor = await this.getMyMember(userId, roomId);
    if (executor.role !== 'OWNER' && executor.role !== 'ADMIN') {
      return {
        message: 'You are not Admin or Owner',
      };
    }

    await this.prisma.member.update({
      where: { id: memberId },
      data: { isMute: status === true ? true : false },
    });

    return {
      message: 'Mute status update',
    };
  }

  /**
   * @description 特定のメンバーをルームから削除する（KICK同様）（Owner or Adminのみ）
   */
  async deleteMember(userId: string, dto: MemberDto): Promise<Msg> {
    const { roomId, memberId, status } = dto;
    const executor = await this.getMyMember(userId, roomId);
    if (executor.role !== 'OWNER' && executor.role !== 'ADMIN') {
      return {
        message: 'You are not Admin or Owner',
      };
    }

    await this.prisma.message.deleteMany({
      where: { memberId },
    });

    await this.prisma.member.delete({
      where: { id: memberId },
    });

    return {
      message: 'Kick the member',
    };
  }
}
