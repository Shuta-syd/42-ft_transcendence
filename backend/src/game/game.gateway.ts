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
    await this.gameService.terminateGame(dto);
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
