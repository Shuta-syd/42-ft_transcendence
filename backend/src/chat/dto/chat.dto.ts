import { ApiProperty } from '@nestjs/swagger';
import { MemberRole, RoomType } from '@prisma/client';

export class SendChatDto {
  @ApiProperty()
  senderName: string;
  @ApiProperty()
  message: string;
}

export class AddMemberDto {
  userId?: string;
  roomId: string;
  status: MemberRole;
  password?: string;
}

export class CreateChatRoom {
  type: RoomType;
  name: string;
  password?: string;
}
export class MuteMemberDto {
  roomId: string;
  memberId: string;
  isMute: boolean;
}

export class MemberDto {
  roomId: string;
  memberId: string;
}

export type ChatPayload = {
  time: string;
  senderName: string;
  text: string;
  id: string;
};

export type FriendPayload = {
  id: string;
  name: string;
};

export type ChatRoomPayload = { [friendId: string]: string };
