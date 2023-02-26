import { ApiProperty } from '@nestjs/swagger';

export class SendChatDto {
  @ApiProperty()
  memberId: string;
  @ApiProperty()
  message: string;
}

export class AddMemberDto {
  userId: string;
  roomId: string;
}

export class CreateChatRoom {
  isDM: string;
  userId: string;
}

export type ChatPayload = {
  time: string;
  text: string;
  id: string;
};

export type TokenPayload = {
  key: string;
};
