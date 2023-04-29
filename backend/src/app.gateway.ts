import { Logger, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { PrismaService } from './prisma/prisma.service';

enum Status {
  OFFLINE = 0,
  ONLINE = 1,
  INGAME = 2,
}

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  private readonly logger: Logger;
  private userIdToStatus: Map<string, Status>;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    this.logger = new Logger('AppGateway');
    this.userIdToStatus = new Map<string, Status>();
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`[App] Cliaent connected ${client.id}`);
    const cookie = client.handshake.headers.cookie;
    if (cookie === undefined) return;
    const accessToken = cookie.split('=')[1].split(';')[0];
    if (accessToken === '') return;
    try {
      const { sub: userId } = await this.jwtService.verify(accessToken, {
        secret: this.configService.get('JWT_SECRET'),
      });
      const user = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (user === null) return;
      client.data.userId = userId;
      this.userIdToStatus.set(userId, Status.ONLINE);
      this.logger.log(`[App] ${userId} is online (socket id: ${client.id}))`);
      console.log(this.userIdToStatus);
    } catch (error) {
      this.logger.error(error);
    }
  }

  handleDisconnect(client: any) {
    this.logger.log(`[App] Client disconnected: ${client.id}`);
    const userId = client.data.userId;
    if (userId === undefined) return;
    this.userIdToStatus.delete(userId);
  }

  /**
   * @description ユーザのオンラインステータスを取得する
   */
  @SubscribeMessage('user_online_status_check')
  async userOnlineStatusCheck(@ConnectedSocket() client: Socket) {
    const cookie = client.handshake.headers.cookie;
    if (cookie === undefined) throw new WsException('unAuthorized');
    const accessToken = cookie.split('=')[1].split(';')[0];
    if (accessToken === '') throw new WsException('unAuthorized');
    const { sub: userId } = await this.jwtService.verify(accessToken, {
      secret: this.configService.get('JWT_SECRET'),
    });
    const status = this.userIdToStatus.get(userId);
    this.server.to(client.id).emit('user_online_status', {
      status,
    });
  }

  /**
   * @description ユーザのフレンドのオンラインステータスを取得する
   */
  @SubscribeMessage('friend_online_status_check')
  async friendOnlineStatusCheck(@ConnectedSocket() client: Socket) {
    const cookie = client.handshake.headers.cookie;
    if (cookie === undefined) throw new WsException('unAuthorized');
    const accessToken = cookie.split('=')[1].split(';')[0];
    if (accessToken === '') throw new WsException('unAuthorized');
    const { sub: userId } = await this.jwtService.verify(accessToken, {
      secret: this.configService.get('JWT_SECRET'),
    });

    const friends = await this.prismaService.user
      .findUnique({
        where: {
          id: userId,
        },
      })
      .friends();

    const OnlineFriend = [];
    const InGameFriend = [];

    friends.forEach(async (friend: User) => {
      let status = this.userIdToStatus.get(friend.id);
      status = status !== undefined ? status : Status.OFFLINE;
      if (status === Status.ONLINE) OnlineFriend.push(friend.id);
      if (status === Status.INGAME) InGameFriend.push(friend.id);
    });

    this.server.to(client.id).emit('friend_online_status', {
      OnlineFriend,
      InGameFriend,
    });
  }

  /**
   * @description ユーザのオンラインステータスを削除する
   */
  @SubscribeMessage('online_status_delete')
  async onlineStatusDelete(@ConnectedSocket() client: Socket) {
    const cookie = client.handshake.headers.cookie;
    if (cookie === undefined) return;
    const accessToken = cookie.split('=')[1].split(';')[0];
    if (accessToken === '') throw new WsException('unAuthorized');
    const { sub: userId } = await this.jwtService.verify(accessToken, {
      secret: this.configService.get('JWT_SECRET'),
    });
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (user === null) throw new WsException('unAuthorized');
    await this.userIdToStatus.delete(userId);
  }

  @SubscribeMessage('in_game_status_check')
  async inGameStatusCheck(@ConnectedSocket() client: Socket) {
    const cookie = client.handshake.headers.cookie;
    if (cookie === undefined) throw new WsException('unAuthorized');
    const accessToken = cookie.split('=')[1].split(';')[0];
    if (accessToken === '') throw new WsException('unAuthorized');
    const { sub: userId } = await this.jwtService.verify(accessToken, {
      secret: this.configService.get('JWT_SECRET'),
    });
    this.userIdToStatus.set(userId, Status.INGAME);
    this.logger.log(`[App] ${userId} is in game`);
  }

  @SubscribeMessage('in_game_status_delete')
  async inGameStatusDelte(@ConnectedSocket() client: Socket) {
    const cookie = client.handshake.headers.cookie;
    if (cookie === undefined) throw new WsException('unAuthorized');
    const accessToken = cookie.split('=')[1].split(';')[0];
    if (accessToken === '') throw new WsException('unAuthorized');
    const { sub: userId } = await this.jwtService.verify(accessToken, {
      secret: this.configService.get('JWT_SECRET'),
    });
    this.userIdToStatus.set(userId, Status.ONLINE);
    this.logger.log(`[App] ${userId} is in game`);
  }
}
