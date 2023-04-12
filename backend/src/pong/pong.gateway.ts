import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PongService } from './pong.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
  namespace: '/game',
})
@WebSocketGateway()
export class PongGateway {
  constructor(private readonly pongService: PongService) {}
  @WebsocketServer()
  server: Server;
}
