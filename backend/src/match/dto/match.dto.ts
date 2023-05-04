import { ApiProperty } from '@nestjs/swagger';

export class MatchDto {
  @ApiProperty()
  player1: string;
  @ApiProperty()
  player2: string;
  @ApiProperty()
  winner_id: string;
  @ApiProperty()
  roomId: string;
}
