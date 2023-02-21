import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatRoom, Member, Message, User } from '@prisma/client';
import { Request } from 'express';
import {
  PrismaChatRoom,
  PrismaMessage,
  SwaggerMessages,
} from 'src/swagger/type';
import { ChatService } from './chat.service';
import { AddMemberDto, SendChatDto } from './dto/chat.dto';

@Controller('chat')
@ApiTags('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('room/:id')
  @ApiOperation({
    description: 'Send a message to the specified chat room',
    summary: 'send a message to the chat room',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The sent the message',
    type: PrismaMessage,
  })
  async sendChat(
    // @Req() req: Request, jwt or passport使用する場合
    @Param('id') roomId: string,
    @Body() dto: SendChatDto,
  ): Promise<Message> {
    return this.chatService.sendChat(roomId, dto);
  }

  @Post('room')
  @ApiOperation({
    description: 'create chat room',
    summary: 'create chat room',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The created chat room',
    type: PrismaChatRoom,
  })
  async createRoom(@Body() isDM: boolean): Promise<ChatRoom> {
    return this.chatService.crateChatRoom(isDM);
  }

  @Get('room/:id')
  @ApiOperation({
    description: 'Get chat logs of specified chat room',
    summary: 'Get chat logs',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The chat logs',
    type: SwaggerMessages,
  })
  async getChatLogByRoomId(@Param('id') id: string): Promise<Message[] | null> {
    return this.chatService.getChatLogByRoomId(id);
  }

  @Post('member/add')
  async addMember(@Body() dto: AddMemberDto): Promise<Member> {
    return this.chatService.addMember(dto.userId, dto.roomId);
  }
}
