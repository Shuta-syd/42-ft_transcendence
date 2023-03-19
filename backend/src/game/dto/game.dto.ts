import { ApiProperty } from '@nestjs/swagger';

export class assignPlayerReq {
  @ApiProperty()
  playerName: string;
}

export class assignPlayerRes {
  @ApiProperty()
  roomId: string;
  playerType: number;
}

export class assignObserverDto {
  @ApiProperty()
  name: string;
  roomId: number;
}

export class assignGuestDto {
  @ApiProperty()
  name: string;
  roomId: string;
}

export class Terminate {
  @ApiProperty()
  player1: string;
  isInviteGame: boolean;
  roomId: string;
}
