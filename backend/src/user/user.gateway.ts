import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class AppGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('getFriendStatus')
  handleGetFriendStatus(client: any, friendId: string): void {
    // ここで、友達のオンライン/オフライン状態を取得し、クライアントに返す
    const status = getFriendStatus(friendId);
    this.server.emit('friendStatus', status);
  }
}

function getFriendStatus(friendId: string): boolean {
  // ここで、友達のオンライン/オフライン状態を取得する処理を記述する
  // 例えば、データベースに問い合わせるなど
  // ここでは、ランダムにオンライン/オフラインを返すようにしている
  return Math.random() < 0.5;
}
