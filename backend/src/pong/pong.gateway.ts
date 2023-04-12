import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PongService } from './pong.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
  namespace: '/pong',
})
@WebSocketGateway()
export class PongGateway {
  constructor(private readonly pongService: PongService) {}
  @WebSocketServer()
  server: Server;

  private wainglist: Socket[] = [];

  handleConnection(client: any, ...args: any[]) {
    console.log('client connected to pong client Id = ', client.id);
    this.wainglist.push(client);
    this.tryMatchPlayers();
  }

  handleInit() {
    console.log('init');
  }

  tryMatchPlayers() {
    if (this.wainglist.length >= 2) {
      const [player1, player2] = this.wainglist.splice(0, 2);
      const groupId = `group-${Date.now()}`;
      player1.join(groupId);
      player2.join(groupId);
      this.server.to(player1.id).emit('match_found', { groupId });
      this.server.to(player2.id).emit('match_found', { groupId });
      console.log(`Match found! Group ID: ${groupId}`);
    } else {
      console.log('Waiting for more players...');
    }
  }
}
