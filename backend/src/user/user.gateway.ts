import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

export type OnlineUsers = { [key: string]: string };
export const OnlineUsers: OnlineUsers = {};

import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class UserGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('getFriendStatus')
  handleGetFriendStatus(client: any, friendId: string): void {
    // ここで、友達のオンライン/オフライン状態を取得し、クライアントに返す
    const status = getFriendStatus(friendId);
    this.server.emit('friendStatus', status);
  }

  handleDisconnect(socket: any) {
    // 接続が切断されたときの処理
    delete OnlineUsers[socket.id];
  }

  afterInit(server: Server) {
    //初期化
  }

  handleConnection(client: Socket, ...args: any[]) {
    //クライアント接続時
  }
}

function getFriendStatus(friendId: string): boolean {
  // if (OnlineUsers[friendId]) {
  //   return true;
  // } else {
  //   return false;
  // }
  // これから追加
  return Math.random() < 0.5;
}
