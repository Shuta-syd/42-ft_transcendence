import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway {
  @WebSocketServer()
  server: Server;
  wsClients = [];

  handleConnection(client: any) {
    this.wsClients.push(client);
  }

  @SubscribeMessage('game')
  chat(@MessageBody() data: any) {
    console.log(data);
    this.broadcast('chat', data.message);
  }

  @SubscribeMessage('game_test')
  emitLoginMessage(@MessageBody() data: any) {
    console.log(data);
    this.broadcast('login', data + 'さんがログインしました。');
  }

  private broadcast(event, message: string) {
    const broadCastMessage = message;
    for (let c of this.wsClients) {
      c.emit(event, broadCastMessage);
    }
  }

  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';
  // }
}
