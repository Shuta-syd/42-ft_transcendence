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

  // @SubscribeMessage('AssignOnline')
  // assignOnline(client: any, name: string): void {
  // }

  handleDisconnect(socket: any) {
    // 接続が切断されたときの処理
    delete OnlineUsers[socket.id];
  }

  afterInit(server: Server) {
    //初期化
  }

  handleConnection(client: Socket, ...args: any[]) {
    // 接続時

    const query = client.handshake.query;
    // クエリパラメータから特定のパラメータを取得
    const exampleParam = query.exampleParam;
    const name = Array.isArray(client.handshake.query.name)
      ? client.handshake.query.name[0]
      : client.handshake.query.name;
    if (!name) {
      return;
    }
    OnlineUsers[client.id] = name;
    console.log('connected', name);
  }
}

function getFriendStatus(friendId: string): boolean {
  if (OnlineUsers[friendId]) {
    return true;
  } else {
    return false;
  }
}
