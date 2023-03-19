import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * @param userId 探索したいユーザのID
   * @returns userIdに関連付けられたUserデータ
   */
  async getUserById(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  /**
   * @param userData フレンド申請したUserId
   * @param friendId フレンド申請先のフレンドID
   * @returns フレンド申請したUserデータ
   */
  async addFriend(userId: string, friendId: string): Promise<User> {
    // const user = await this.getUserById(userId);
    // const friend = await this.getUserById(friendId);

    this.prisma.user.update({
      where: {
        id: friendId,
      },
      data: {
        friends: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        friends: {
          connect: {
            id: friendId,
          },
        },
      },
    });
  }

  /**
   * @param userId 取得したフレンドリストのuserId
   * @returns userIdのユーザのフレンドリスト
   */
  async getFriend(userId: string): Promise<User[]> {
    const friends: User[] = [];

    const followings = await this.prisma.user
      .findUnique({
        where: {
          id: userId,
        },
      })
      .friends();

    const followers = await this.prisma.user
      .findUnique({ where: { id: userId } })
      .friendRelation();

    followings.forEach((following: User) => {
      const friend = followers.find((follower) => follower.id === following.id);
      if (friend !== undefined) friends.push(friend);
    });
    return friends;
  }
}
