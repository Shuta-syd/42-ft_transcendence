/* eslint-disable prettier/prettier */
import { GameReWriteService } from './game-rewrite.service';
import { BallPosDto, PaddleDto, ScoreDto } from './game-rewrite.dto';
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
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { Game, InviteGame } from "@prisma/client";

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
  namespace: '/game-rewrite',
})
export class GameReWriteGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly matchService: MatchService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly gameService: GameReWriteService,
  ) {}

  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('GameReWriteGateway');

  async handleConnection(client: Socket) {
    this.logger.log(`[Game] Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    let userID = '';
    this.logger.log(`[Game] Client disconnected: ${client.id}`);

    const cookie = client.handshake.headers.cookie;
    if (cookie === undefined) throw new WsException('unAuthorized');
    const accessToken = cookie.split('=')[1].split(';')[0];
    if (accessToken === '') throw new WsException('unAuthorized');
    try {
      const { sub: userId } = await this.jwtService.verify(accessToken, {
        secret: this.configService.get('JWT_SECRET'),
      });
      userID = userId;
    } catch (error) {
      return;
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userID,
      },
    });
    if (!user) return;

    await axios.post('http://localhost:8080/game/status/off', {
      userId: userID,
    });

    let isInviteGame = false;
    const UserNameToRandomGameRoomId =
      this.gameService.getUserNameToRandomGameRoomId();
    const UserNameToInviteGameRoomId =
      this.gameService.getUserNameToInviteGameRoomId();
    let roomId = UserNameToRandomGameRoomId.get(user.name);

    if (roomId === undefined) {
      roomId = UserNameToInviteGameRoomId.get(user.name);
      isInviteGame = true;
    }
    if (roomId === undefined) return; // 例外?

    this.server.to(roomId).emit('ExitGame');
    // matchの存在判定 -> あったら即リターン
    const isAlreadyMatched = await this.prisma.match.findFirst({
        where: {
            roomId,
        }
    });
    if (isAlreadyMatched !== null) return;

    let gameRoom = null;
    if (!isInviteGame) {
      gameRoom = await this.prisma.game.findUnique({
        where: {
          id: parseInt(roomId),
        },
      });
    } else {
      gameRoom = await this.prisma.inviteGame.findUnique({
        where: {
          id: roomId,
        },
      });
    }

    if (gameRoom === null) return;
    let isOngoing = null;
    if (!isInviteGame) {
      isOngoing = await this.prisma.game.findUnique({
        where: {
          id: parseInt(roomId),
        }
      });
      if (isOngoing && isOngoing.onGoing === false)
        return;
    } else {
      isOngoing = await this.prisma.inviteGame.findUnique({
        where: {
          id: roomId,
        }
      });
      if (isOngoing && isOngoing.onGoing === false)
        return;
    }


    console.log(gameRoom, user.name, gameRoom.player1, gameRoom.player2);
    console.log('disconnect');

    if (
      gameRoom.player1 === user.name &&
      !gameRoom.player2.includes('player2')
    ) {
      await this.matchService.createMatch({
        player1: user.name,
        player2: gameRoom.player2,
        winner_id: '2',
      });
    } else if (gameRoom.player2 === user.name) {
      await this.matchService.createMatch({
        player1: gameRoom.player1,
        player2: user.name,
        winner_id: '1',
      });
    }

    if (!isInviteGame) {
      await this.gameService.DeleteRandomGameRoom({
        playerName: user.name,
        roomId: roomId,
      });
    } else {
      await this.gameService.DeleteInviteGameRoom({
        playerName: user.name,
        roomId: roomId,
      });
    }
  }

  /**
   * @description paddle情報を受け取り他プレイヤーに送るに用いられるイベント
   */
  @SubscribeMessage('GameToServer')
  sendPaddleInfoToRoomClients(
    @MessageBody() payload: PaddleDto,
    @ConnectedSocket() client: Socket,
  ) {
    const UserNameToRandomGameRoomId =
      this.gameService.getUserNameToRandomGameRoomId();
    const UserNameToInviteGameRoomId =
      this.gameService.getUserNameToInviteGameRoomId();
    let roomId = UserNameToRandomGameRoomId.get(payload.playerName);

    if (roomId === undefined)
      roomId = UserNameToInviteGameRoomId.get(payload.playerName);
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
    @ConnectedSocket() client: Socket,
  ) {
    const UserNameToRandomGameRoomId =
      this.gameService.getUserNameToRandomGameRoomId();
    const UserNameToInviteGameRoomId =
      this.gameService.getUserNameToInviteGameRoomId();
    let roomId = UserNameToRandomGameRoomId.get(payload.playerName);

    if (roomId === undefined)
      roomId = UserNameToInviteGameRoomId.get(payload.playerName);
    if (roomId === undefined) return; // 例外?

    this.server.to(roomId).emit('BallPosToClient', payload, client.id);
  }

  /**
   * @description ゲームルームにプレイヤーが参加するためのイベント
   */
  @SubscribeMessage('JoinRoom')
  handleJoinRoom(
    @MessageBody() payload: { name: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (payload.name === undefined) return; // 例外? cookieで検証する必要ある?

    const UserNameToRandomGameRoomId =
      this.gameService.getUserNameToRandomGameRoomId();
    const UserNameToInviteGameRoomId =
      this.gameService.getUserNameToInviteGameRoomId();
    let roomId = UserNameToRandomGameRoomId.get(payload.name);

    if (roomId === undefined)
      roomId = UserNameToInviteGameRoomId.get(payload.name);
    if (roomId === undefined) return; // 例外?

    this.logger.log(`[Game] Client ${client.id} Join : ${roomId}`);
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

    const UserNameToRandomGameRoomId =
      this.gameService.getUserNameToRandomGameRoomId();
    const UserNameToInviteGameRoomId =
      this.gameService.getUserNameToInviteGameRoomId();
    let roomId = UserNameToRandomGameRoomId.get(payload.name);

    if (roomId === undefined)
      roomId = UserNameToInviteGameRoomId.get(payload.name);
    if (roomId === undefined) return; // 例外?

    this.logger.log(`[Game] Client ${client.id} Join : ${roomId}`);
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

    const UserNameToRandomGameRoomId =
      this.gameService.getUserNameToRandomGameRoomId();
    const UserNameToInviteGameRoomId =
      this.gameService.getUserNameToInviteGameRoomId();
    let roomId = UserNameToRandomGameRoomId.get(payload.name);

    if (roomId === undefined)
      roomId = UserNameToInviteGameRoomId.get(payload.name);
    if (roomId === undefined) return; // 例外?

    this.server.to(roomId).emit('Ping', payload, client.id);
  }
  @SubscribeMessage('Pong')
  async handlePong(
      @MessageBody() payload: { name: string },
      @ConnectedSocket() client: Socket,
  ) {
    if (!payload.name) return; // 例外? cookieで検証する必要ある?

    const isGameExist = await this.prisma.game.findUnique({
      where: {player2: payload.name},
    });
    if (isGameExist) {
      const game = await this.prisma.game.update({
        where: {player2: payload.name},
        data: {onGoing: true},
      });
      if (game){
        this.server.to(game.id.toString()).emit('Pong', payload, client.id, game.id.toString());
        return game;
      }

    } else {
      const inviteGame = await this.prisma.inviteGame.findUnique({
        where: {player2: payload.name},
      });
      if (inviteGame) {
        const inviteGame = await this.prisma.inviteGame.update({
          where: {player2: payload.name},
          data: {onGoing: true},
        });
        if (inviteGame) {
          this.server.to(inviteGame.id).emit('Pong', payload, client.id, inviteGame.id);
          return inviteGame;
        }
      }
    }
    return null;
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

    const UserNameToRandomGameRoomId =
      this.gameService.getUserNameToRandomGameRoomId();
    const UserNameToInviteGameRoomId =
      this.gameService.getUserNameToInviteGameRoomId();
    let roomId = UserNameToRandomGameRoomId.get(payload.playerName);

    if (roomId === undefined)
      roomId = UserNameToInviteGameRoomId.get(payload.playerName);
    if (roomId === undefined) return; // 例外?

    this.server.to(roomId).emit('ScoreToClient', payload, client.id);
  }

  @SubscribeMessage('TerminateGame')
  async handleTerminateGame(
    @MessageBody() payload: { name: string },
    @ConnectedSocket() client: Socket,
  ): Promise<Game | InviteGame | null> {

    let roomId: string;
    let inviteGame: InviteGame;

    const game: Game = await this.prisma.game.findUnique({
      where: {
        player1: payload.name,
        // player2: dto.player2,
      },
    });
    if (game && game.onGoing) {
      //gameに入っている場合
      roomId = game.id.toString();
      const isgame = await this.prisma.game.delete({
        where: {
          id: parseInt(roomId)
        },
      });
      return isgame;
    } else {
      //gameに入ってない場合
      //inviteGameに入っているか確認
      inviteGame = await this.prisma.inviteGame.findUnique({
        where: {
          player1: payload.name,
          // player2: dto.player2,
        },
      });
      roomId = inviteGame.id;
      const isinviteGame = await this.prisma.inviteGame.delete({
        where: {
          id: roomId,
        },
      });
      return isinviteGame;
    }
    return null;
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }
}
