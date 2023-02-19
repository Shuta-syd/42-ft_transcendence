import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * @param userId 探索したいユーザのID
   * @returns userIdに関連付けられたUserデータ
   */
  async getUserById(userId: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  /**
   * @param data //今後Dtoに変更する可能性大
   * @returns 作成したUserのデータ
   */
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  /**
   * @param userData フレンド申請したUserId
   * @param friendId フレンド申請先のフレンドID
   * @returns フレンド申請したUserデータ
   */
  async addFriend(
    userData: { userId: number },
    friendId: string,
  ): Promise<User> {
    // const user = await this.getUserById(userData.userId);
    // const friend = await this.getUserById(parseInt(friendId));

    this.prisma.user.update({
      where: {
        id: parseInt(friendId),
      },
      data: {
        friends: {
          connect: {
            id: userData.userId,
          },
        },
      },
    });

    return this.prisma.user.update({
      where: {
        id: userData.userId,
      },
      data: {
        friends: {
          connect: {
            id: parseInt(friendId),
          },
        },
      },
    });
  }
}
