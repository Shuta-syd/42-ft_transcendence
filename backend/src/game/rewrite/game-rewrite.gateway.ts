/* eslint-disable prettier/prettier */
import { GameServiceReWrite } from './game-rewrite.service';
import { DeleteGameDto } from './game-rewrite.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { MatchService } from 'src/match/match.service';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
  namespace: '/chat',
})
export class GameReWriteGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly matchService: MatchService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly gameService: GameServiceReWrite,
  ) {}

  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('GameReWriteGateway');

  async handleConnection(client: Socket) { return; }

  async handleDisconnect(client: Socket) { return; }

  afterInit(server: Server) {
    this.logger.log('Init');
  }
}
