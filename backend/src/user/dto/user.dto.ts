import { ApiProperty } from '@nestjs/swagger';

export class SignUpUserDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password?: string;
  @ApiProperty()
  image: string;
  @ApiProperty()
  isFtLogin?: boolean;
}

export class FriendReq {
  @ApiProperty()
  requester: string;
  @ApiProperty()
  requestee: string;
}

export class AcceptFriend {
  @ApiProperty()
  friendId: string;
}
