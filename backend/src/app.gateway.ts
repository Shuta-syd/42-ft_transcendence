import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
  namespace: '/',
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('AppGateway');

  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`[App] Client connected ${client.id}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`[App] Client disconnected: ${client.id}`);
  }

  afterInit(server: any) {
    this.logger.log('[App] Initialized');
  }
}
