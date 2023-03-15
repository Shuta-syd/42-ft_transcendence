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
