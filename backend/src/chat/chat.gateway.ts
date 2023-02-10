import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('Connected', socket.id);
    });
  }

  @SubscribeMessage('send_message')
  listenForMessages(@MessageBody() data: string) {
    console.log('data:[', data, ']');
    this.server.emit('onMessage', {
      msg: 'New Message',
      content: data,
    });
  }
}
