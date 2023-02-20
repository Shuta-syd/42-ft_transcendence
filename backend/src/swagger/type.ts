/************************************************************************
 * Swagger API Propertyに使用する型であり、実装では使用しないでください *
 ************************************************************************ */

import { ApiProperty } from '@nestjs/swagger';

/**
 * Model Message
 *
 */
export class PrismaMessage {
  @ApiProperty()
  id: number;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  message: string;
  @ApiProperty()
  userId: number;
  @ApiProperty()
  roomId: number;
}

/**
 * Model ChatRoom
 *
 */
export class PrismaChatRoom {
  @ApiProperty()
  id: number;
  @ApiProperty({ type: [PrismaMessage] })
  messages: PrismaMessage[];
}

/**
 * Model User
 *
 */
export class PrismaUser {
  @ApiProperty()
  id: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  password: string;
  @ApiProperty({ type: [PrismaUser] })
  friends: PrismaUser[];
  @ApiProperty({ type: [PrismaMessage] })
  messages: PrismaMessage[];
}

export class SwaggerFriends {
  @ApiProperty({ type: [PrismaUser] })
  friends: PrismaUser[];
}

export class SwaggerMessages {
  @ApiProperty({ type: [PrismaMessage] })
  friends: PrismaMessage[];
}
