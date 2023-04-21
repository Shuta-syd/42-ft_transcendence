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
    this.logger.log(`[App] Client connected ${client.id}`);
    const cookie = client.handshake.headers.cookie;
    if (cookie === undefined) return;
    const accessToken = cookie.split('=')[1];
    if (accessToken === '') return;
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
  }

  handleDisconnect(client: any) {
    this.logger.log(`[App] Client disconnected: ${client.id}`);
    const userId = client.data.userId;
    if (userId === undefined) return;
    this.userIdToStatus.delete(userId);
  }

  @SubscribeMessage('online_status_check')
  async onlineStatusCheck(@ConnectedSocket() client: Socket) {
    const cookie = client.handshake.headers.cookie; //接続タイミングのcookieが保持されるためうまくオンラインステータスの設定ができていない
    if (cookie === undefined) throw new WsException('unAuthorized');
    const accessToken = cookie.split('=')[1];
    if (accessToken === '') throw new WsException('unAuthorized');
    const { sub: userId } = await this.jwtService.verify(accessToken, {
      secret: this.configService.get('JWT_SECRET'),
    });
    const status = this.userIdToStatus.get(userId);
    this.server.to(client.id).emit('my_online_status', {
      status,
    });
  }

  @SubscribeMessage('online_status_delete')
  async onlineStatusDelete(@ConnectedSocket() client: Socket) {
    const cookie = client.handshake.headers.cookie;
    if (cookie === undefined) return;
    const accessToken = cookie.split('=')[1];
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
  @UseGuards(AuthGuard('jwt'))
  inGameStatusCheck(@ConnectedSocket() client: Socket, user: User) {
    this.userIdToStatus.set(user.id, Status.INGAME);
    this.logger.log(`[App] ${user.id} is in game`);
  }
}
