import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { NameToRoomIdDic } from './game.service';

type ChatRecieved = {
  uname: string;
  time: string;
  text: string;
  name: string;
};

type BallPos = {
  x: number;
  y: number;
  name: string;
};

type PaddleAndRoom = {
  paddleHeight: number;
  name: string;
};

type RoomId = {
  name: string;
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
    // this.logger.log(payload);
    // this.logger.log('chat受信');
    //emit()とすると、指定した名前をリッスンしているクライアントに情報をプッシュできる
    const roomId: string = NameToRoomIdDic[payload.name];
    this.server
      .to(roomId)
      .emit('chatToClient', { ...payload, socketId: client.id });
  }
  @SubscribeMessage('GameToServer')
  ReceiveGameInfo(
    @MessageBody() payload: PaddleAndRoom,
    @ConnectedSocket() client: Socket,
  ): void {
    console.log('GAME to server', payload.paddleHeight);
    console.log('GAME to server', payload.name);
    console.log('Event happend');
    const roomId: string = NameToRoomIdDic[payload.name];
    console.log(roomId);
    this.server.to(roomId).emit('GameToClient', payload, client.id);
  }
  @SubscribeMessage('BallPosToServer')
  ReceiveBallPosInfo(
    @MessageBody() payload: BallPos,
    @ConnectedSocket() client: Socket,
  ): void {
    const roomId: string = NameToRoomIdDic[payload.name];
    this.server.to(roomId).emit('BallPosToClient', payload, client.id);
  }
  // ユーザーがルームに参加するたnめのイベントを定義します
  @SubscribeMessage('JoinRoom')
  handleJoinRoom(
    @MessageBody() payload: string,
    @ConnectedSocket() socket: Socket,
  ): void {
    // ユーザーをルームに参加させます
    if (!payload) return;
    const roomId: string = NameToRoomIdDic[payload];
    socket.join(roomId);
    // ルームが存在しない場合は、新しいルームを作成します
    if (!this.rooms[roomId]) {
      this.rooms[roomId] = [];
    }
    // ユーザーをルームの参加者リストに追加します
    this.rooms[roomId].push(socket.id);
    // ルームの参加者リストをルームの全員に送信します
    this.server.to(roomId).emit(roomId, this.rooms[roomId]);
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
    console.log(`game Client disconnected: ${socket.id}`);
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
