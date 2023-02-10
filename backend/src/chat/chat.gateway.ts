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

  @SubscribeMessage('send_message') // to subscribeEvent
  //@MessageBody clientから送られてくるbody内容
  listenForMessages(@MessageBody() data: string) {
    this.server.emit('onMessage', {
      content: data,
    });
  }
}
