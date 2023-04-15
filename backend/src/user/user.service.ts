import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

    const ret = this.prisma.user.update({
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
    return ret;
  }

  /**
   * @param userId
   * @param friendId
   */
  async deleteFriend(userId: string, friendId: string): Promise<User> {
    this.prisma.user.update({
      where: {
        id: friendId,
      },
      data: {
        friends: {
          disconnect: {
            id: userId,
          },
        },
      },
    });

    const ret = this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        friends: {
          disconnect: {
            id: friendId,
          },
        },
      },
    });
    return ret;
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

  /**
   * @param name
   * @returns nameを含むUser
   */
  searchFriendByName(name: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: {
        name: {
          equals: name,
        },
      },
    });
  }

  /**
   * @description Friend 申請のhandler requesterの名前をdatebaseに格納
   * @return setしたrequesteeのデータ
   * @param userId
   * @param friendId
   */
  async areFriends(userId: string, friendId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { friends: true },
    });

    if (!user) {
      return false;
    }

    return user.friends.some((friend: User) => friend.id === friendId);
  }

  async handleFriendReq(
    userId: string,
    friendId: string,
  ): Promise<string[] | null> {
    if (userId == friendId) {
      return null;
    }

    const res = await this.getBlockList(friendId);
    if (res.some((item) => item.id === userId)) {
      return null;
    }

    const requestee = await this.prisma.user.findUnique({
      where: {
        id: friendId,
      },
    });

    if (!requestee) {
      return null;
    }

    const alreadyFriends = await this.areFriends(userId, friendId);
    if (alreadyFriends) {
      return null;
    }

    const reqesters = requestee.friendReqs.filter(
      (item: string) => item !== userId,
    );

    if (userId !== null) {
      reqesters.push(userId);
    }

    const updatedUser = this.prisma.user.update({
      where: {
        id: friendId,
      },
      data: {
        friendReqs: reqesters,
      },
    });

    return updatedUser.then((user: User) => {
      return user.friendReqs;
    });
  }

  async getFriendReqs(userId: string): Promise<string[] | null> {
    const req = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!req) {
      return null;
    }
    return req.friendReqs;
  }

  async acceptFriendreq(
    userId: string,
    friendId: string,
  ): Promise<User | null> {
    if (userId === friendId) {
      return null;
    }
    const res = await this.getBlockList(friendId);
    if (res.some((item) => item.id === userId)) {
      return null;
    }

    await this.addFriend(userId, friendId);
    await this.addFriend(friendId, userId);

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return null;
    }

    // 友達リクエストからfriendIdを削除
    const filteredFriendReqs = user.friendReqs.filter(
      (item: string) => item !== friendId,
    );

    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        friendReqs: filteredFriendReqs,
      },
    });
  }

  async rejectFriendReq(
    userid: string,
    friendId: string,
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userid,
      },
    });

    if (!user) {
      return null;
    }

    // 友達リクエストからfriendIdを削除
    const filteredFriendReqs = user.friendReqs.filter(
      (item: string) => item !== friendId,
    );

    return this.prisma.user.update({
      where: {
        id: userid,
      },
      data: {
        friendReqs: filteredFriendReqs,
      },
    });
  }

  /******************
   ***** Block ******
   ******************/

  /**
   * 指定されたユーザーIDがブロックされているかどうかを判断する。
   * @param blockerId ブロックを確認したいユーザーのID
   * @param blockedId ブロック確認対象のユーザーのID
   * @returns 指定されたユーザーIDがブロックされている場合はtrue、そうでない場合はfalse
   * @throws NotFoundException 指定されたユーザーIDが存在しない場合
   */
  async isUserBlocked(blockerId: string, blockedId: string): Promise<boolean> {
    // blockerとblockedが存在しているか確認
    const blocker = await this.getUserById(blockerId);
    if (!blocker) {
      throw new NotFoundException(`User with ID "${blockerId}" not found.`);
    }
    const blocked = await this.getUserById(blockedId);
    if (!blocked) {
      throw new NotFoundException(`User with ID "${blockedId}" not found.`);
    }

    const blockRelation = await this.prisma.blockList.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId: blockerId,
          blockedId: blockedId,
        },
      },
    });

    return !!blockRelation;
  }

  /**
   * ブロックリストにエントリを追加してユーザーをブロックする。
   * @param blockerId ブロックするユーザーのID
   * @param blockedId ブロックされるユーザーのID
   * @returns ブロック関係が作成された後、ブロックしたユーザーのUserインスタンス
   */
  async blockUser(blockerId: string, blockedId: string): Promise<User> {
    // blockerIdとblockedIdが同じであればエラー
    if (blockerId === blockedId) {
      throw new BadRequestException('You cannot block yourself.');
    }
    // blokerId、blockedIdのUserがいるか存在確認
    const blocker = await this.getUserById(blockerId);
    if (!blocker) {
      throw new NotFoundException(`User with ID "${blockerId}" not found.`);
    }
    const blocked = await this.getUserById(blockedId);
    if (!blocked) {
      throw new NotFoundException(`User with ID "${blockedId}" not found.`);
    }

    // 既にブロック関係があるか確認
    const isExistingBlock = await this.isUserBlocked(blockerId, blockedId);
    if (isExistingBlock) {
      throw new ConflictException('The block relationship already exists.');
    }
    // BlockListテーブルにブロック関係を追加
    await this.prisma.blockList.create({
      data: {
        blockerId: blockerId,
        blockedId: blockedId,
      },
    });
    return blocker;
  }

  /**
   * ブロックリストからエントリを削除してユーザーのブロックを解除する。
   * @param blockerId ブロックを解除したいユーザーのID
   * @param blockedId ブロック解除されるユーザーのID
   * @returns ブロック関係が削除された後、ブロックを解除したユーザーのUserインスタンス
   */
  async unblockUser(blockerId: string, blockedId: string): Promise<User> {
    // blockerIdとblockedIdが同じであればエラー
    if (blockerId === blockedId) {
      throw new BadRequestException('You cannot block yourself.');
    }
    // blokerId、blockedIdのUserがいるか存在確認
    const blocker = await this.getUserById(blockerId);
    if (!blocker) {
      throw new NotFoundException(`User with ID "${blockerId}" not found.`);
    }
    const blocked = await this.getUserById(blockedId);
    if (!blocked) {
      throw new NotFoundException(`User with ID "${blockedId}" not found.`);
    }

    try {
      // BlockListテーブルからブロック関係を削除
      await this.prisma.blockList.delete({
        where: {
          blockerId_blockedId: {
            blockerId: blockerId,
            blockedId: blockedId,
          },
        },
      });
    } catch (error) {
      // 削除しようとしたブロック関係が見つからなかった場合、エラーを返す
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Block relation between user with ID "${blockerId}" and user with ID "${blockedId}" not found.`,
        );
      } else {
        throw error;
      }
    }

    return blocker;
  }

  /**
   * 指定されたユーザーIDのブロックリストを取得する。
   * @param userId ブロックリストを取得したいユーザーのID
   * @returns 指定されたユーザーIDのブロックリストに含まれるユーザーの配列
   */
  async getBlockList(userId: string): Promise<User[]> {
    // userIdのUserがいるか存在確認
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        blockingUsers: {
          include: {
            blocked: true,
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    }

    // ブロックリストに含まれるユーザーの配列を返す
    return user.blockingUsers.map((blocklist) => blocklist.blocked);
  }
}
