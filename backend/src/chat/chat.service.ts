import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BlockList, ChatRoom, Member, Message, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import {
  AddMemberDto,
  CreateChatRoom,
  LeaveMemberDto,
  MemberDto,
  MuteMemberDto,
  SendChatDto,
  UpdateChatRoom,
} from './dto/chat.dto';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const asyncScrypt = promisify(scrypt);

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
    let hashedPassword: string = dto.password;

    if (dto.type === 'PROTECT') {
      const salt = randomBytes(8).toString('hex');
      const hash = (await asyncScrypt(dto.password, salt, 32)) as Buffer;
      hashedPassword = hash.toString() + '.' + salt;
    }
    const room = this.prisma.chatRoom
      .create({
        data: {
          type: dto.type,
          password: hashedPassword,
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
    return room;
  }

  /**
   * @description DM Roomの作成 user, friendどちらもメンバーとして追加
   */
  async crateDMRoom(
    userName: string,
    userId: string,
    dto: CreateChatRoom,
  ): Promise<{ room: ChatRoom; isNew: boolean; friend: User }> {
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
      return { room: alreadyCreated, isNew: false, friend: undefined };

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

    const friend = await this.prisma.user.findUnique({
      where: {
        id: dto.friendId,
      },
    });

    return { room, isNew: true, friend };
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
      include: {
        members: {
          include: {
            user: true,
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
  async getChatLogByRoomId(roomId: string, userId: string): Promise<Message[]> {
    const blocking = await this.prisma.blockList.findMany({
      where: { blockerId: userId },
    });

    const blockedUserIds = blocking.map(
      (blockedUser: BlockList) => blockedUser.blockedId,
    );

    const messages = await this.prisma.message.findMany({
      where: {
        roomId,
        NOT: {
          senderUserId: {
            in: blockedUserIds,
          },
        },
      },
    });

    return messages;
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
          room: {
            connect: { id: roomId },
          },
          senderName: dto.senderName,
          senderUserId: userId,
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
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });
    return channels;
  }

  async updateChannel(userId: string, roomId: string, dto: UpdateChatRoom) {
    const executor = await this.getMyMember(userId, roomId);
    if (!executor) throw new NotFoundException('executor is not found');
    if (executor.role !== 'OWNER')
      throw new ForbiddenException('You are not a channel owner');

    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
    });

    let NewHashedPassword: string;

    if (room.type === 'PROTECT') {
      const [storedHash, salt] = room.password.split('.');

      const hashedPassword = (
        (await asyncScrypt(dto.oldPassword, salt, 32)) as Buffer
      ).toString();
      if (storedHash !== hashedPassword.toString())
        throw new UnauthorizedException('Password is wrong');

      const newSalt = randomBytes(8).toString('hex');
      const hash = (await asyncScrypt(dto.newPassword, newSalt, 32)) as Buffer;
      NewHashedPassword = hash.toString() + '.' + salt;
    }

    return this.prisma.chatRoom.update({
      where: { id: roomId },
      data: {
        password: NewHashedPassword,
        name: dto.name,
        type: dto.type,
      },
    });
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

    if (room.type === 'PROTECT') {
      const [storedHash, salt] = room.password.split('.');

      const hashedPassword = (
        (await asyncScrypt(dto.password, salt, 32)) as Buffer
      ).toString();
      if (storedHash !== hashedPassword.toString())
        throw new UnauthorizedException('Password is wrong');
    }

    const members = await this.prisma.chatRoom
      .findUnique({
        where: {
          id: dto.roomId,
        },
      })
      .members();

    if (members) {
      members.map((member) => {
        if (member.userId === userId)
          throw new NotAcceptableException('You are already a member');
      });
    }

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

    const member = await this.prisma.member.findUnique({
      where: {
        id: dto.memberId,
      },
    });
    if (member.role === 'OWNER')
      throw new ForbiddenException('OWNER cannot be kicked');

    await this.prisma.member.update({
      where: { id: memberId },
      data: { isMute: isMute === true ? true : false },
    });
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

    const member = await this.prisma.member.findUnique({
      where: {
        id: dto.memberId,
      },
    });
    if (member.role === 'OWNER')
      throw new ForbiddenException('OWNER cannot be kicked');

    await this.prisma.member.delete({
      where: { id: memberId },
    });
  }

  /**
   * @description OWNERが退出した時にOWNER権限を委譲する関数
   */
  async giveOwnerShip() {
    const secondAdmin = await this.prisma.member.findFirst({
      where: {
        role: 'ADMIN',
      },
      orderBy: {
        createAt: 'asc',
      },
    });

    if (secondAdmin == undefined || secondAdmin == null) {
      const members = await this.prisma.member.findMany({
        orderBy: {
          createAt: 'asc',
        },
        take: 2,
      });
      if (members[1] !== null && members[1] !== undefined) {
        await this.prisma.member.update({
          where: {
            id: members[1].id,
          },
          data: {
            role: 'OWNER',
          },
        });
      }
    } else {
      await this.prisma.member.update({
        where: {
          id: secondAdmin.id,
        },
        data: {
          role: 'OWNER',
        },
      });
    }
  }

  /**
   * @description 自ユーザがChatRoomから離脱する
   */
  async leaveChatRoom(userId: string, dto: LeaveMemberDto) {
    const { roomId } = dto;
    const member = await this.getMyMember(userId, roomId);
    if (!member) throw new NotFoundException('member not found');

    if (member.role === 'OWNER') {
      await this.giveOwnerShip();
    }

    await this.prisma.member.delete({
      where: { id: member.id },
    });

    const members = await this.prisma.chatRoom
      .findUnique({
        where: { id: dto.roomId },
      })
      .members();

    if (members.length === 0) {
      await this.prisma.message.deleteMany({
        where: {
          roomId: dto.roomId,
        },
      });
      await this.prisma.chatRoom.delete({
        where: { id: dto.roomId },
      });
    }
  }

  /**
   * @description 特定のユーザを出禁にする
   */
  async banUserOnChatRoom(userId: string, dto: MemberDto) {
    const { roomId, memberId } = dto;

    const user = await this.getUserByMemberId(memberId);
    if (!user) throw new NotFoundException('member not found');
    await this.deleteMember(userId, dto);
    await this.prisma.banUserOnChatRoom.create({
      data: {
        baned_userId: user.id,
        roomId: roomId,
      },
    });
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

    if (!members) throw new NotFoundException("Members aren't be found");

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
