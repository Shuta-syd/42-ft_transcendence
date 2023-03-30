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

  /**
   * @description nameを含むfriendsを検索して返す
   */
  async searchFriend(userId: string, name: string): Promise<User[]> {
    const userFriends = await this.getFriend(userId);

    const result: User[] = userFriends.filter((friend) =>
      friend.name.includes(name),
    );

    return result;
  }
  /**
   * @description User tableに対して、imageをsetできるようにする
   * @param userId imageをsetしたいUserのID
   * @param image setしたいimageのURL
   * @return setしたUserのデータ
   */
  async addUserImage(userId: string, image: string) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        image: image,
      },
    });
  }

  /**
   * @description Userのimageを取得する
   */
  async getUserImage(userId: string): Promise<string> {
    const user = await this.getUserById(userId);
    return user.image;
  }
}
