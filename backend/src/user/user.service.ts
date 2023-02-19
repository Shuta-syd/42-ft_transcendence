import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserById(userId: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async addFriend(
    userData: { userId: number },
    friendId: string,
  ): Promise<User> {
    const user = await this.getUserById(userData.userId);
    const friend = await this.getUserById(parseInt(friendId));

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
