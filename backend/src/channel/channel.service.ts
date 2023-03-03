import { Injectable } from '@nestjs/common';
import { ChatRoom } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChannelService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

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
