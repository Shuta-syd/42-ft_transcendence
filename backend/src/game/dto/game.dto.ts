import { ApiProperty } from '@nestjs/swagger';
import {AbstractInstanceResolver} from "@nestjs/core/injector/abstract-instance-resolver";

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
  player: string;
  isInviteGame: boolean;
  roomId: string;
}
