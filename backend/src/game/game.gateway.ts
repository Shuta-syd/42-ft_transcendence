/*
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

*/

import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

type ChatRecieved = {
  uname: string;
  time: string;
  text: string;
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway {
  @WebSocketServer()
  server: Server;

  //ログ出力用
  private logger: Logger = new Logger('EventsGateway');

  //クライアント側から「chatToServer」という名前のメッセージ（？）をリッスン（好きに命名できる）
  @SubscribeMessage('chatToServer')
  chatting(@MessageBody() payload: ChatRecieved, @ConnectedSocket() client: Socket): void {
    //@MessageBody→受信したデータ
    //@ConnectedSocket→ユーザーのID（websocketで自動で割り当てられる）や、その他接続に関する情報など
    this.logger.log('chat受信');
    this.logger.log(payload);
    //emit()とすると、指定した名前をリッスンしているクライアントに情報をプッシュできる
    this.server.emit('chatToClient', { ...payload, socketId: client.id });
  }

  afterInit(server: Server) {
    //初期化
    this.logger.log('初期化しました。');
  }

  handleConnection(client: Socket, ...args: any[]) {
    //クライアント接続時
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    //クライアント切断時
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
