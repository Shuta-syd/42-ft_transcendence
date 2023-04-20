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
  WsException,
} from '@nestjs/websockets';
import { User } from '@prisma/client';
import { Socket } from 'socket.io';
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

  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`[App] Client connected ${client.id}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`[App] Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('online_status_check')
  async onlineStatusCheck(@ConnectedSocket() client: Socket) {
    const cookie = client.handshake.headers.cookie;
    if (cookie === undefined) throw new WsException('unAuthorized');
    const accessToken = cookie.split('=')[1];
    if (accessToken === '') throw new WsException('unAuthorized');
    console.log(accessToken);
    const { sub: userId } = await this.jwtService.verify(accessToken, {
      secret: this.configService.get('JWT_SECRET'),
    });
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    console.log(user.name);
    if (user === null) throw new WsException('unAuthorized');
    client.data.userId = userId;
    this.userIdToStatus.set(userId, Status.ONLINE);
    this.logger.log(`[App] ${userId} is online (socket id: ${client.id}))`);
    console.log(this.userIdToStatus);
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
    console.log(this.userIdToStatus);
  }

  @SubscribeMessage('in_game_status_check')
  @UseGuards(AuthGuard('jwt'))
  inGameStatusCheck(@ConnectedSocket() client: Socket, user: User) {
    this.userIdToStatus.set(user.id, Status.INGAME);
    this.logger.log(`[App] ${user.id} is in game`);
  }
}
