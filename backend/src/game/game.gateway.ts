
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { anyNumber } from "jest-mock-extended";

type ChatRecieved = {
  uname: string;
  time: string;
  text: string;
  room: string;
};

type BallPos = {
  x: number;
  y: number;
  room: string;
};

type PaddleAndRoom = {
  paddleHeight: number;
  room: string;
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway {
  @WebSocketServer()
  server: Server;

  private rooms = {};

  private logger: Logger = new Logger('EventsGateway');
  //クライアント側から「chatToServer」という名前のメッセージ（？）をリッスン（好きに命名できる）
  @SubscribeMessage('chatToServer')
  chatting(
    @MessageBody() payload: ChatRecieved,
    @ConnectedSocket() client: Socket,
  ): void {
    //@MessageBody受信したデータ
    //@ConnectedSocket→ユーザーのID（websocketで自動で割り当てられる）や、その他接続に関する情報など
    this.logger.log('chat受信');
    this.logger.log(payload);
    //emit()とすると、指定した名前をリッスンしているクライアントに情報をプッシュできる
    this.server
      .to(payload.room)
      .emit('chatToClient', { ...payload, socketId: client.id });
  }
  @SubscribeMessage('GameToServer')
  ReceiveGameInfo(
    @MessageBody() payload: PaddleAndRoom,
    @ConnectedSocket() client: Socket,
  ): void {
    this.logger.log('message info received');
    this.logger.log(payload);
    console.log(payload);
    this.server.to(payload.room).emit('GameToClient', payload, client.id);
  }
  @SubscribeMessage('BallPosToServer')
  ReceiveBallPosInfo(
    @MessageBody() payload: BallPos,
    @ConnectedSocket() client: Socket,
  ): void {
    this.logger.log('game info received');
    this.logger.log(payload);
    console.log(payload);
    this.server.to(payload.room).emit('BallPosToClient', payload, client.id);
  }

  // ユーザーがルームに参加するたnめのイベントを定義します
  @SubscribeMessage('JoinRoom')
  handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() socket: Socket,
  ): void {
    // ユーザーをルームに参加させます
    socket.join(room);
    // ルームが存在しない場合は、新しいルームを作成します
    if (!this.rooms[room]) {
      this.rooms[room] = [];
    }
    // ユーザーをルームの参加者リストに追加します
    this.rooms[room].push(socket.id);
    // ルームの参加者リストをルームの全員に送信します
    this.server.to(room).emit('update room', this.rooms[room]);
  }

  // ユーザーがルームから離脱するためのイベントを定義します
  @SubscribeMessage('LeaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() socket: any,
    @MessageBody() room: string,
  ): void {
    // ユーザーをルームから削除します
    socket.leave(room);
    if (this.rooms[room]) {
      // ユーザーをルームの参加者リストから削除します
      this.rooms[room] = this.rooms[room].filter((id) => id !== socket.id);
      // ルームの参加者リストをルームの全員に送信します
      this.server.to(room).emit('update room', this.rooms[room]);
    }
  }

  // 接続が切断されたときの処理
  handleDisconnect(socket: any) {
    console.log(`Client disconnected: ${socket.id}`);
    // ルームからユーザーを削除します
    Object.keys(this.rooms).forEach((room) => {
      this.rooms[room] = this.rooms[room].filter((id) => id !== socket.id);
      // ルームの参加者リストをルームの全員に送信します
      this.server.to(room).emit('update room', this.rooms[room]);
    });
  }

  afterInit(server: Server) {
    //初期化
    this.logger.log('初期化しました。');
  }

  handleConnection(client: Socket, ...args: any[]) {
    //クライアント接続時
    this.logger.log(`Client connected: ${client.id}`);
  }
}
