import {
  IsEmail,
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsUUID,
  IsBase64,
} from 'class-validator';
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

export class UserDto {
  @ApiProperty()
  @IsUUID()
  id: string;
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  twoFactorSecret?: string;
  @ApiProperty()
  @IsBoolean()
  isTwoFactorEnabled: boolean;
  @ApiProperty()
  @IsString()
  image: string;
  @ApiProperty()
  @IsBoolean()
  isFtLogin: boolean;
  @ApiProperty()
  @IsArray()
  @IsUUID(4, { each: true })
  friendReqs: string[];
}
