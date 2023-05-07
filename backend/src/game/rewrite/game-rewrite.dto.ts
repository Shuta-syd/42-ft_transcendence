import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class DeleteGameDto {
  playerName: string;
  roomId: string;
}

export class GameIdDto {
  @ApiProperty()
  roomId: string;
}

export class InviteGameDto {
  invitedPlayerName: string;
  roomId: string;
}

/**
 * -----------------GameReWriteGateway-----------------
 */
export class BallPosDto {
  x: number;
  y: number;
  playerName: string;
}

export class PaddleDto {
  paddleHeight: number;
  playerName: string;
}

export class ScoreDto {
  player1: number;
  player2: number;
  playerName: string;
}
