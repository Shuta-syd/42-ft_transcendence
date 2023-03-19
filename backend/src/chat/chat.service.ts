import { Injectable } from '@nestjs/common';
import { ChatRoom, Member, Message, User } from '@prisma/client';
import { Msg } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import {
  AddMemberDto,
  CreateChatRoom,
  LeaveMemberDto,
  MemberDto,
  MuteMemberDto,
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
        this.addMember(userId, {
          roomId: room.id,
          status: 'OWNER',
          password: dto.password,
        });
        return room;
      });
  }

  /**
   * @description DM Roomの作成 user, friendどちらもメンバーとして追加
   */
  async crateDMRoom(userId: string, dto: CreateChatRoom): Promise<ChatRoom> {
    const room = await this.prisma.chatRoom.create({
      data: {
        type: dto.type,
        password: dto.password,
        name: dto.name === undefined ? 'unknown' : dto.name,
      },
    });

    await this.addMember(userId, {
      roomId: room.id,
      status: 'NORMAL',
      password: dto.password,
    });

    await this.addMember(dto.friendId, {
      roomId: room.id,
      status: 'NORMAL',
      password: dto.password,
    });

    return room;
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
   * @param userId 取得したいDMのuserID
   * @returns userIDのすべてのDM
   */
  async getUserDM(userId: string): Promise<ChatRoom[]> {
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

    return DirectMessageRooms;
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
   * ===Channel service==
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
   * @description 与えられたnameからチャンネルを検索する（部分一致）
   */
  async searchChannel(userId: string, name: string): Promise<ChatRoom[]> {
    if (name === undefined) return [];

    const rooms = this.prisma.chatRoom.findMany({
      where: {
        NOT: [{ type: 'DM' }, { type: 'PRIVATE' }],
        members: {
          none: {
            userId,
          },
        },
        name: {
          contains: name,
        },
      },
    });
    return rooms;
  }

  /**
   * ===Member CRUD===
   *
  /**
   * @description MemberIdから紐付けられたUserデータを取得
   */
  async getUserByMemberId(memberId: string): Promise<User> {
    return this.prisma.member
      .findUnique({
        where: {
          id: memberId,
        },
      })
      .user();
  }

  async updateMemberRole(userId: string, dto: MemberDto): Promise<Msg> {
    const { memberId, roomId } = dto;

    const executor = await this.getMyMember(userId, roomId);
    if (executor.role !== 'OWNER') {
      return {
        message: 'You are not Owner',
      };
    }

    const target = await this.prisma.member.findUnique({
      where: { id: memberId },
    });

    if (target.role === 'OWNER') {
      return {
        message: 'Owner can be changed to ADMIN or NORMAL',
      };
    } else if (target.role === 'NORMAL') {
      await this.prisma.member.update({
        where: { id: memberId },
        data: { role: 'ADMIN' },
      });
    } else {
      await this.prisma.member.update({
        where: { id: memberId },
        data: { role: 'NORMAL' },
      });
    }

    return {
      message: 'Member Role updated',
    };
  }

  /**
   * @param userId 所属させたいuserID
   * @param roomId 所属させたいChat RoomID
   * @returns 作成したMember object
   */
  async addMember(userId: string, dto: AddMemberDto): Promise<Member> {
    const banedList = await this.prisma.user
      .findUnique({
        where: {
          id: userId,
        },
      })
      .banned();

    const isBan = banedList.filter((val) => val.roomId === dto.roomId);
    if (isBan.length !== 0) throw new Error("You couldn't enter the room");

    const room = await this.getChatRoomById(dto.roomId);
    if (room.type === 'PROTECT' && dto.password !== room.password)
      throw new Error('Password is wrong');

    return this.prisma.member.create({
      data: {
        room: {
          connect: {
            id: dto.roomId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
        role: dto.status === undefined ? 'NORMAL' : dto.status,
      },
      include: {
        user: true,
      },
    });
  }

  /**
   * @description 特定のメンバーをMuteもしくはunMuteにする（Owner or Adminのみ）
   */
  async muteMember(userId: string, dto: MuteMemberDto): Promise<Msg> {
    const { roomId, memberId, isMute } = dto;
    const executor = await this.getMyMember(userId, roomId);
    if (executor.role !== 'OWNER' && executor.role !== 'ADMIN') {
      return {
        message: 'You are not Admin or Owner',
      };
    }

    await this.prisma.member.update({
      where: { id: memberId },
      data: { isMute: isMute === true ? true : false },
    });

    return {
      message: 'Mute status update',
    };
  }

  /**
   * @description 特定のメンバーをルームから削除する（KICK同様）（Owner or Adminのみ）
   */
  async deleteMember(userId: string, dto: MemberDto): Promise<Msg> {
    const { roomId, memberId } = dto;
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

  /**
   * @description 自ユーザがChatRoomから離脱する
   */
  async leaveChatRoom(userId: string, dto: LeaveMemberDto): Promise<Msg> {
    const { roomId } = dto;
    const member = await this.getMyMember(userId, roomId);

    await this.prisma.message.deleteMany({
      where: { memberId: member.id },
    });

    await this.prisma.member.delete({
      where: { id: member.id },
    });

    return {
      message: 'leave the room',
    };
  }

  /**
   * @description 特定のユーザを出禁にする
   */
  async banUserOnChatRoom(userId: string, dto: MemberDto): Promise<Msg> {
    const { roomId, memberId } = dto;

    const user = await this.getUserByMemberId(memberId);
    await this.deleteMember(userId, dto);
    await this.prisma.banUserOnChatRoom.create({
      data: {
        baned_userId: user.id,
        roomId: roomId,
      },
    });

    return {
      message: 'ban the member',
    };
  }
}
