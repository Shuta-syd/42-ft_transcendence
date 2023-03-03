import { ApiProperty } from '@nestjs/swagger';

export class SendChatDto {
  @ApiProperty()
  memberId: string;
  @ApiProperty()
  senderName: string;
  @ApiProperty()
  message: string;
}

export class AddMemberDto {
  userId: string;
  roomId: string;
}

export class CreateChatRoom {
  isDM: string;
  name: string;
}

export type ChatPayload = {
  time: string;
  senderName: string;
  text: string;
  id: string;
};

export type TokenPayload = {
  key: string;
};

export type FriendPayload = {
  id: string;
  name: string;
};

export type ChatRoomPayload = { [friendId: string]: string };
