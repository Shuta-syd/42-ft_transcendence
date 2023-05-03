/* eslint-disable prettier/prettier */
import { GameReWriteService } from './game-rewrite.service';
import { BallPosDto, DeleteGameDto, PaddleDto, ScoreDto } from './game-rewrite.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { MatchService } from 'src/match/match.service';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
  namespace: '/game',
})
export class GameReWriteGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly jwtService: JwtService,
    private readonly matchService: MatchService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly gameService: GameReWriteService,
  ) { }

  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('GameReWriteGateway');

  async handleConnection(client: Socket) { return; }

  async handleDisconnect(client: Socket) { return; }

  /**
   * @description paddle情報を受け取り他プレイヤーに送るに用いられるイベント
   */
  @SubscribeMessage('GameToServer')
  sendPaddleInfoToRoomClients(
    @MessageBody() payload: PaddleDto,
    @ConnectedSocket() client: Socket,
  ) {
    const UserNameToRandomGameRoomId = this.gameService.getUserNameToRandomGameRoomId();
    const UserNameToInviteGameRoomId = this.gameService.getUserNameToInviteGameRoomId();
    let roomId = UserNameToRandomGameRoomId[payload.playerName];

    if (roomId === undefined)
      roomId = UserNameToInviteGameRoomId[payload.playerName];
    if (roomId === undefined) return; // 例外?

    this.server.to(roomId).emit('GameToClient', payload, client.id);
  }

  /**
   * @description ball情報を受け取り他プレイヤーに送るに用いられるイベント
   * player1から受け取るのか？
   */
  @SubscribeMessage('BallPosToServer')
  sendBallInfoToRoomClients(
    @MessageBody() payload: BallPosDto,
    @ConnectedSocket() client: Socket
  ) {
    const UserNameToRandomGameRoomId = this.gameService.getUserNameToRandomGameRoomId();
    const UserNameToInviteGameRoomId = this.gameService.getUserNameToInviteGameRoomId();
    let roomId = UserNameToRandomGameRoomId[payload.playerName];

    if (roomId === undefined)
      roomId = UserNameToInviteGameRoomId[payload.playerName];
    if (roomId === undefined) return; // 例外?

    this.server.to(roomId).emit('GameToClient', payload, client.id);
  }

  /**
   * @description ゲームルームにプレイヤーが参加するためのイベント
   */
  @SubscribeMessage('JoinRoom')
  handleJoinRoom(
    @MessageBody() payload: { name: string },
    @ConnectedSocket() client: Socket
  ) {
    if (payload.name === undefined) return; // 例外? cookieで検証する必要ある?

    const UserNameToRandomGameRoomId = this.gameService.getUserNameToRandomGameRoomId();
    const UserNameToInviteGameRoomId = this.gameService.getUserNameToInviteGameRoomId();
    let roomId = UserNameToRandomGameRoomId[payload.name];

    if (roomId === undefined)
      roomId = UserNameToInviteGameRoomId[payload.name];
    if (roomId === undefined) return; // 例外?

    client.join(roomId);
  }

  /**
   * @description ゲームルームにプレイヤーが脱退するためのイベント
   */
  @SubscribeMessage('LeaveRoom')
  handleLeaveRoom(
    @MessageBody() payload: { name: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (payload.name === undefined) return; // 例外? cookieで検証する必要ある?

    const UserNameToRandomGameRoomId = this.gameService.getUserNameToRandomGameRoomId();
    const UserNameToInviteGameRoomId = this.gameService.getUserNameToInviteGameRoomId();
    let roomId = UserNameToRandomGameRoomId[payload.name];

    if (roomId === undefined)
      roomId = UserNameToInviteGameRoomId[payload.name];
    if (roomId === undefined) return; // 例外?

    client.leave(roomId);
  }

  /**
   * @description プライヤーがルームに入室しているか確認するためのポーリングイベント
   */
  @SubscribeMessage('Ping')
  handlePing(
    @MessageBody() payload: { name: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (payload.name === undefined) return; // 例外? cookieで検証する必要ある?

    const UserNameToRandomGameRoomId = this.gameService.getUserNameToRandomGameRoomId();
    const UserNameToInviteGameRoomId = this.gameService.getUserNameToInviteGameRoomId();
    let roomId = UserNameToRandomGameRoomId[payload.name];

    if (roomId === undefined)
      roomId = UserNameToInviteGameRoomId[payload.name];
    if (roomId === undefined) return; // 例外?

    this.server.to(roomId).emit('Ping', payload, client.id);
  }

  /**
   * @description スコア情報をルームに属するプレイヤーに送信するためのイベント
   */
  @SubscribeMessage('ScoreToServer')
  handleGameScore(
    @MessageBody() payload: ScoreDto,
    @ConnectedSocket() client: Socket,
  ) {
    if (payload.playerName === undefined) return; // 例外? cookieで検証する必要ある?

    const UserNameToRandomGameRoomId = this.gameService.getUserNameToRandomGameRoomId();
    const UserNameToInviteGameRoomId = this.gameService.getUserNameToInviteGameRoomId();
    let roomId = UserNameToRandomGameRoomId[payload.playerName];

    if (roomId === undefined)
      roomId = UserNameToInviteGameRoomId[payload.playerName];
    if (roomId === undefined) return; // 例外?

    this.server.to(roomId).emit('ScoreToClient', payload, client.id);
  }

  @SubscribeMessage('TerminateGame')
  async handleTerminateGame(
    @MessageBody() payload: { name: string },
    @ConnectedSocket() client: Socket,
  ) {
    let isInviteGame = false;

    const UserNameToRandomGameRoomId = this.gameService.getUserNameToRandomGameRoomId();
    const UserNameToInviteGameRoomId = this.gameService.getUserNameToInviteGameRoomId();
    let roomId = UserNameToRandomGameRoomId[payload.name];

    if (roomId === undefined) {
      roomId = UserNameToInviteGameRoomId[payload.name];
      isInviteGame = true;
    }
    if (roomId === undefined) return; // 例外?

    if (!isInviteGame) await this.gameService.DeleteRandomGameRoom({ playerName: payload.name, roomId, });
    else await this.gameService.DeleteInviteGameRoom({ playerName: payload.name, roomId, });
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }
}
