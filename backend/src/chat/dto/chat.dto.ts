import { ApiProperty } from '@nestjs/swagger';

export class SendChatDto {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  message: string;
}
