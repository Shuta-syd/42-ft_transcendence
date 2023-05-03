import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { NameToInviteRoomIdDic, NameToRoomIdDic } from './game.service';
import { GameService } from './game.service';
import { Terminate } from './dto/game.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { MatchService } from 'src/match/match.service';
import axios from 'axios';

// ここでボールの型を定義
type BallPos = {
  x: number;
  y: number;
  name: string;
};

// paddle info
type PaddleAndRoom = {
  paddleHeight: number;
  name: string;
};

type RoomId = {
  name: string;
};

//scoer info
type Score = {
  player1: number;
  player2: number;
  name: string;
};

// game終了時に用いる型のinfo
type TerminateGame = {
  player1: string;
  isInviteGame: boolean;
  roomId: string;
};

//disconnect時に用いる型のinfo
export type SocketClient = {
  name: string;
  socketId: string;
};

const SocketClients: SocketClient[] = [];

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
  namespace: '/game',
})
export class GameGateway {
  constructor(
    private readonly jwtService: JwtService,
    private readonly matchService: MatchService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly gameService: GameService,
  ) {}
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('GameGateway');
  // roomごとにsocketの情報を管理する
  private rooms = {};

  //game の情報paddle情報の管理に用いられるイベント
  @SubscribeMessage('GameToServer')
  ReceiveGameInfo(
    @MessageBody() payload: PaddleAndRoom,
    @ConnectedSocket() client: Socket,
  ): void {
    //room IDを取得
    let roomId: string = NameToRoomIdDic[payload.name];
    if (roomId === undefined) {
      roomId = NameToInviteRoomIdDic[payload.name];
    }
    //もう一方のクライアントに対してpaddle情報を送信
    this.server.to(roomId).emit('GameToClient', payload, client.id);
  }

  // ballの情報を管理するイベント
  @SubscribeMessage('BallPosToServer')
  ReceiveBallPosInfo(
    @MessageBody() payload: BallPos,
    @ConnectedSocket() client: Socket,
  ): void {
    //room IDを取得
    let roomId: string = NameToRoomIdDic[payload.name];
    if (roomId === undefined) {
      roomId = NameToInviteRoomIdDic[payload.name];
    }
    // もう一方のクライアントに対してball情報を送信
    this.server.to(roomId).emit('BallPosToClient', payload, client.id);
  }

  // ユーザーがルームに参加するたnめのイベントを定義します
  // roomの登録を行おう
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

    /**
     * ここの処理の意味がわからない
     */
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

  // ユーザーがルームから離脱するためのイベントを定義
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

  // ユーザーがルームから入室しているのかを確かめるためのイベントを定義
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

  //pong に対する応答のためのイベント
  //現在は使ってない
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

  //スコアの情報を管理するイベント
  //player1から送られてきた情報をplayer2に対して送る
  @SubscribeMessage('ScoreToServer')
  handleGameScore(
    @MessageBody() payload: Score,
    @ConnectedSocket() client: Socket,
  ): void {
    //room IDを取得
    let roomId: string = NameToRoomIdDic[payload.name];
    if (roomId === undefined) {
      roomId = NameToInviteRoomIdDic[payload.name];
    }
    // もう一方のクライアントに対してscore情報を送信
    this.server.to(roomId).emit('ScoreToClient', payload, client.id);
  }

  //ゲームの終了を管理するイベント
  @SubscribeMessage('TerminateGame')
  async terminateGame(
    @MessageBody() name: string,
    @ConnectedSocket() client: Socket,
  ) {
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
    //terminateGameを実行
    await this.gameService.terminateGame(dto);
    //socketを削除
    await delete SocketClients[SocketClients.findIndex((e) => e.name === name)];
  }


  // 接続が切断されたときの処理
  async handleDisconnect(client: Socket) {
    this.logger.log(`[Game] Client disconnected: ${client.id}`);
    const cookie = client.handshake.headers.cookie;
    if (cookie === undefined) throw new WsException('unAuthorized');
    const accessToken = cookie.split('=')[1].split(';')[0];
    if (accessToken === '') throw new WsException('unAuthorized');
    const { sub: userId } = await this.jwtService.verify(accessToken, {
      secret: this.configService.get('JWT_SECRET'),
    });

    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) return;
    await axios.post('http://localhost:8080/game/status/off', { userId });
    const roomId = NameToRoomIdDic[user.name];
    this.server.to(roomId).emit('ExitGame');

    if (user == null) return;

    const isExitPlayer1 = await this.prismaService.game.findFirst({
      where: {
        player1: user.name,
      },
    });
    try {
      if (
        !isExitPlayer1.player2.includes('player2') &&
        isExitPlayer1.player1 === user.name
      ) {
        await this.matchService.createMatch({
          player1: user.name,
          player2: isExitPlayer1.player2,
          winner_id: '2',
        });
        await this.prismaService.game.delete({
          where: {
            id: isExitPlayer1.id,
          },
        });
        return;
      } else if (
        isExitPlayer1.player2.includes('player2') &&
        isExitPlayer1.player1 === user.name
      ) {
        await this.prismaService.game.delete({
          where: {
            id: isExitPlayer1.id,
          },
        });
      }
    } catch {}

    const isExitPlayer2 = await this.prismaService.game.findFirst({
      where: {
        player2: user.name,
      },
    });
    try {
      if (isExitPlayer1.player1 !== null) {
        await this.matchService.createMatch({
          player1: isExitPlayer2.player1,
          player2: user.name,
          winner_id: '1',
        });
        await this.prismaService.game.delete({
          where: {
            id: isExitPlayer2.id,
          },
        });
      } else {
        await this.prismaService.game.delete({
          where: {
            id: isExitPlayer2.id,
          },
        });
      }
    } catch {}
  }

  afterInit(server: Server) {
    //初期化
    this.logger.log('初期化しました。');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`[Game] Client connected: ${client.id}`);
  }
}
