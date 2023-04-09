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
import { ChatPayload } from './dto/chat.dto';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
  namespace: '/chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('ChatGateway');

  handleDisconnect(client: Socket) {
    this.logger.log(`[Chat] Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`[Chat] Client connected ${client.id}`);
  }

  @SubscribeMessage('send_message_room')
  sendMessage(
    @MessageBody() payload: ChatPayload,
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(payload.id).emit('chatToClient', {
      ...payload,
      socketId: client.id,
    });
  }

  @SubscribeMessage('join_chat_room')
  handleJoinRoom(
    @MessageBody() payload: { id: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(
      'Join Room: ',
      `client[${client.id}] join ChatRoom ${payload.id}`,
    );
    client.join(payload.id);
  }

  @SubscribeMessage('leave_chat_room')
  handleLeaveChatRoom(
    @MessageBody() payload: { id: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(
      'Leave Room: ',
      `client[${client.id}] leave ChatRoom ${payload.id}`,
    );
    client.leave(payload.id);
  }

  @SubscribeMessage('update_channel_info')
  updateChannelInfo(
    @MessageBody() payload: { id: string; name: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.server.emit('updateChannelInfo', {
      ...payload,
    });
    this.logger.log(`Update Channel [${payload.id}]: by client[${client.id}] `);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }
}
