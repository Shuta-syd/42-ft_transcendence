import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
   * === Chat Room ===
   */

  /**
   * @description ChatRoomを作成してuserIdのユーザをMemberとして追加する
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
  async crateDMRoom(
    userName: string,
    userId: string,
    dto: CreateChatRoom,
  ): Promise<{ room: ChatRoom; isNew: boolean }> {
    let alreadyCreated: ChatRoom = undefined;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          include: {
            room: {
              include: {
                members: true,
              },
            },
          },
        },
      },
    });

    user.memberships.forEach((myMember) => {
      if (myMember.room.type !== 'DM') return;
      myMember.room.members.map((member) => {
        if (member.userId === dto.friendId) alreadyCreated = myMember.room;
      });
    });

    // すでにDMルームがあった場合はそのルームを返す
    if (alreadyCreated !== undefined)
      return { room: alreadyCreated, isNew: false };

    const room = await this.prisma.chatRoom.create({
      data: {
        type: dto.type,
        password: dto.password,
        name: `${dto.name},${userName}`,
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

    return { room, isNew: true };
  }

  /**
   * @param roomId 取得したいroomのID
   * @returns 取得したRoomデータ
   */
  async getChatRoomById(roomId: string): Promise<ChatRoom> {
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        members: { include: { user: true } },
      },
    });

    // roomが見つからない場合は例外処理
    if (!room) throw new NotFoundException('chat room not found');

    return room;
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

    if (chatRoom) throw new NotFoundException('chat room not found');

    return chatRoom.messages;
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
    if (member.isMute === true)
      throw new NotAcceptableException('You are not right');

    try {
      const message = this.prisma.message.create({
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
      return message;
    } catch (error) {
      throw new BadRequestException('DTO is whether large or too small');
    }
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

  async updateMemberRole(userId: string, dto: MemberDto) {
    const { memberId, roomId } = dto;

    const executor = await this.getMyMember(userId, roomId);
    if (executor.role !== 'OWNER') {
      throw new ForbiddenException('You are not Owner');
    }

    const target = await this.prisma.member.findUnique({
      where: { id: memberId },
    });

    if (target.role === 'OWNER') {
      throw new ForbiddenException(
        'Owner cannot be changed to ADMIN or NORMAL',
      );
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
    if (isBan.length !== 0)
      throw new ForbiddenException("You couldn't enter the room");

    const room = await this.getChatRoomById(dto.roomId);
    if (!room) throw new NotFoundException('chat room is not found');
    else if (room.type === 'PROTECT' && dto.password !== room.password)
      throw new UnauthorizedException('Password is wrong');

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
  async muteMember(userId: string, dto: MuteMemberDto) {
    const { roomId, memberId, isMute } = dto;
    const executor = await this.getMyMember(userId, roomId);
    if (!executor) throw new NotFoundException('executor is not found');
    if (executor.role !== 'OWNER' && executor.role !== 'ADMIN')
      throw new ForbiddenException('You could not mute');

    const member = await this.prisma.member.update({
      where: { id: memberId },
      data: { isMute: isMute === true ? true : false },
    });

    if (!member) throw new Error('mutation exception error');
  }

  /**
   * @description 特定のメンバーをルームから削除する（KICK同様）（Owner or Adminのみ）
   */
  async deleteMember(userId: string, dto: MemberDto) {
    const { roomId, memberId } = dto;
    const executor = await this.getMyMember(userId, roomId);
    if (!executor) throw new NotFoundException('executor is not found');
    if (executor.role !== 'OWNER' && executor.role !== 'ADMIN')
      throw new ForbiddenException('You could not mute');

    await this.prisma.message.deleteMany({
      where: { memberId },
    });

    await this.prisma.member.delete({
      where: { id: memberId },
    });
  }

  /**
   * @description 自ユーザがChatRoomから離脱する
   */
  async leaveChatRoom(userId: string, dto: LeaveMemberDto) {
    const { roomId } = dto;
    const member = await this.getMyMember(userId, roomId);
    if (!member) throw new NotFoundException('member not found');

    await this.prisma.message.deleteMany({
      where: { memberId: member.id },
    });

    await this.prisma.member.delete({
      where: { id: member.id },
    });
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
    const userMember = members?.filter(
      (member: Member) => member.userId === userId,
    );

    return userMember[0];
  }

  /**
   * ==== Utils ====
   */
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
}
