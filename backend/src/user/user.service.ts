import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { SignUpUserDto } from './dto/user.dto';

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
  async signupUser(data: SignUpUserDto): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  /**
   * @param userData フレンド申請したUserId
   * @param friendId フレンド申請先のフレンドID
   * @returns フレンド申請したUserデータ
   */
  async addFriend(userId: number, friendId: number): Promise<User> {
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
  async getFriend(userId: number): Promise<User[]> {
    return this.prisma.user
      .findUnique({
        where: {
          id: userId,
        },
      })
      .friends();
  }
}
