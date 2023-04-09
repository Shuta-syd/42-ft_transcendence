import { Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { User } from '@prisma/client';
import { Socket } from 'socket.io';

enum Status {
  ONLINE = 1,
  INGAME = 2,
}

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
  namespace: '/',
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger;
  private userIdToStatus: Map<string, Status>;

  constructor() {
    this.logger = new Logger('AppGateway');
    this.userIdToStatus = new Map<string, Status>();
  }

  handleConnection(client: any, ...args: any[]) {
    console.log(client);
    this.logger.log(`[App] Client connected ${client.id}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`[App] Client disconnected: ${client.id}`);
  }

  afterInit(server: any) {
    this.logger.log('[App] Initialized');
  }

  @SubscribeMessage('online_status_check')
  @UseGuards(AuthGuard('jwt'))
  onlineStatusCheck(@ConnectedSocket() client: Socket, user: User) {
    this.userIdToStatus.set(user.id, Status.ONLINE);
    this.logger.log(`[App] ${user.id} is online`);
  }

  @SubscribeMessage('in_game_status_check')
  @UseGuards(AuthGuard('jwt'))
  inGameStatusCheck(@ConnectedSocket() client: Socket, user: User) {
    this.userIdToStatus.set(user.id, Status.INGAME);
    this.logger.log(`[App] ${user.id} is in game`);
  }
}
