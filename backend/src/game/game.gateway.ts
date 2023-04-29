import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { NameToInviteRoomIdDic, NameToRoomIdDic } from './game.service';
import { GameService } from './game.service';
import { Terminate } from './dto/game.dto';

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

type Score = {
  player1: number;
  player2: number;
  name: string;
};

type TerminateGame = {
  player1: string;
  isInviteGame: boolean;
  roomId: string;
};

export type SocketClient = {
  name: string;
  socketId: string;
};

let SocketClients: SocketClient[] = [];

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
  namespace: '/game',
})
export class GameGateway {
  constructor(private readonly gameService: GameService) {}
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('GameGateway');
  private rooms = {};

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
    let roomId: string = NameToRoomIdDic[payload.name];
    if (roomId === undefined) {
      roomId = NameToInviteRoomIdDic[payload.name];
    }
    this.server
      .to(roomId)
      .emit('chatToClient', { ...payload, socketId: client.id });
  }
  @SubscribeMessage('GameToServer')
  ReceiveGameInfo(
    @MessageBody() payload: PaddleAndRoom,
    @ConnectedSocket() client: Socket,
  ): void {
    let roomId: string = NameToRoomIdDic[payload.name];
    if (roomId === undefined) {
      roomId = NameToInviteRoomIdDic[payload.name];
    }
    this.server.to(roomId).emit('GameToClient', payload, client.id);
  }
  @SubscribeMessage('BallPosToServer')
  ReceiveBallPosInfo(
    @MessageBody() payload: BallPos,
    @ConnectedSocket() client: Socket,
  ): void {
    let roomId: string = NameToRoomIdDic[payload.name];
    if (roomId === undefined) {
      roomId = NameToInviteRoomIdDic[payload.name];
    }
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

    let roomId: string = NameToRoomIdDic[payload];
    if (roomId === undefined) {
      roomId = NameToInviteRoomIdDic[payload];
    }
    socket.join(roomId);
    // ルームが存在しない場合は、新しいルームを作成します
    if (!this.rooms[roomId]) {
      this.rooms[roomId] = [];
    }
    // ユーザーをルームの参加者リストに追加します
    this.rooms[roomId].push(socket.id);
    // ルームの参加者リストをルームの全員に送信します
    this.server.to(roomId).emit(roomId, this.rooms[roomId]);
    //すでにnameが存在している場合にはその内容を苦心する仕様を追加する必要あり。
    SocketClients.push({ name: payload, socketId: socket.id });
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

  @SubscribeMessage('Ping')
  handlePing(
    @MessageBody() name: string,
    @ConnectedSocket() client: Socket,
  ): void {
    let roomId: string = NameToRoomIdDic[name];
    if (roomId === undefined) {
      roomId = NameToInviteRoomIdDic[name];
    }
    this.server.to(roomId).emit('Ping', name, client.id);
  }

  @SubscribeMessage('Pong')
  handlePong(
    @MessageBody() name: string,
    @ConnectedSocket() client: Socket,
  ): void {
    let roomId: string = NameToRoomIdDic[name];
    if (roomId === undefined) {
      roomId = NameToInviteRoomIdDic[name];
    }
    this.server.to(roomId).emit('Pong', name, client.id);
  }

  @SubscribeMessage('ScoreToServer')
  handleGameScore(
    @MessageBody() payload: Score,
    @ConnectedSocket() client: Socket,
  ): void {
    let roomId: string = NameToRoomIdDic[payload.name];
    if (roomId === undefined) {
      roomId = NameToInviteRoomIdDic[payload.name];
    }
    this.server.to(roomId).emit('ScoreToClient', payload, client.id);
  }

  @SubscribeMessage('TerminateGame')
  terminateGame(
    @MessageBody() name: string,
    @ConnectedSocket() client: Socket,
  ): void {
    const dto = { isInviteGame: false, player: '' };
    if (NameToInviteRoomIdDic[name]) {
      dto.isInviteGame = true;
      dto.player = name;
    } else if (NameToRoomIdDic[name]) {
      dto.isInviteGame = false;
      dto.player = name;
    } else {
      return;
    }
    this.gameService.terminateGame(dto);
    delete SocketClients[SocketClients.findIndex((e) => e.name === name)];
  }

  // 接続が切断されたときの処理
  handleDisconnect(socket: Socket) {
    this.logger.log(`[Game] Client disconnected: ${socket.id}`);
    // // ルームからユーザーを削除します // エラー
    // Object.keys(this.rooms).forEach((room) => {
    //   this.rooms[room] = this.rooms[room].filter((id) => id !== socket.id);
    //   // ルームの参加者リストをルームの全員に送信します
    //   this.server.to(room).emit('update room', this.rooms[room]);
    //   if (
    //     socket.id ===
    //     SocketClients.find((client) => client.socketId === socket.id)?.socketId
    //   ) {
    //     //このuserを負けにする処理
    //     SocketClients = SocketClients.filter(
    //       (client) => client.socketId !== socket.id,
    //     );
    //   }
    // });
  }

  afterInit(server: Server) {
    //初期化
    this.logger.log('初期化しました。');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`[Game] Client connected: ${client.id}`);
  }
}
