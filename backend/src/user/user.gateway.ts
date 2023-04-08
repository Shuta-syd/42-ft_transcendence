import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

interface OnlineUsers {
  name: string;
  clientId: string;
}

let OnlineUsers: OnlineUsers[] = [];

import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class UserGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('getFriendStatus')
  handleGetFriendStatus(client: any, friend: string): void {
    // ここで、友達のオンライン/オフライン状態を取得し、クライアントに返す
    console.log('getFrienedStatus', friend);
    const status = getFriendStatus(friend);
    this.server.emit('friendStatus', status);
  }

  // @SubscribeMessage('AssignOnline')
  // assignOnline(client: any, name: string): void {
  // }

  handleDisconnect(socket: any) {
    // console.log('dissconected', socket.id);
    const filteredUsers = OnlineUsers.filter(
      (OnlineUsers) => OnlineUsers.clientId !== socket.id,
    );
    OnlineUsers = filteredUsers;
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
    console.log('connected name = ', name);
    console.log('connected id = ', client.id);
    OnlineUsers.push({ name: name, clientId: client.id });
    console.log(
      'after connected [id] = ',
      OnlineUsers.filter((user) => user.clientId === client.id).map(
        (user) => user.name,
      ),
    );
  }
}

function getFriendStatus(friend: string): boolean {
  const filteredUsers = OnlineUsers.filter(
    (OnlineUsers) => OnlineUsers.name === friend,
  );
  if (filteredUsers.length > 0) {
    console.log('true');
    return true;
  } else {
    console.log('false');
    return false;
  }
}
