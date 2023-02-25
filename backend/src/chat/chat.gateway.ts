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
import { Server, Socket } from 'socket.io';
import { ChatPayload, TokenPayload } from './dto/chat.dto';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('ChatGateway');
  private key = 0;

  @SubscribeMessage('send_message') // to subscribeEvent
  //@MessageBody clientから送られてくるbody内容
  handleMessage(
    @MessageBody() payload: ChatPayload,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log('Chat Received');
    this.logger.log(payload);
    this.server.emit('chatToClient', {
      ...payload,
      socketId: client.id,
    });
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected ${client.id}`);
    const token: TokenPayload = { key: this.key.toString() };
    this.server.to(client.id).emit('token', token);
    this.key += 1;
  }
}
