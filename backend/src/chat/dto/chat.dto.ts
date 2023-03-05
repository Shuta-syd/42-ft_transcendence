import { ApiProperty } from '@nestjs/swagger';
import { MemberRole } from '@prisma/client';

export class SendChatDto {
  @ApiProperty()
  senderName: string;
  @ApiProperty()
  message: string;
}

export class AddMemberDto {
  roomId: string;
  status: MemberRole;
}

export class CreateChatRoom {
  isDM: string;
  name: string;
}
export class muteMemberDto {
  roomId: string;
  memberId: string;
  status: boolean;
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
