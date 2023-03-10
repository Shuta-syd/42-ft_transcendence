import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatRoom, Member, Message, User } from '@prisma/client';
import { Request } from 'express';
import { Msg } from 'src/auth/dto/auth.dto';
import {
  PrismaChatRoom,
  PrismaMessage,
  SwaggerMessages,
} from 'src/swagger/type';
import { ChatService } from './chat.service';
import {
  AddMemberDto,
  MemberDto,
  ChatRoomPayload,
  CreateChatRoom,
  SendChatDto,
} from './dto/chat.dto';

@Controller('chat')
@ApiTags('chat')
@UseGuards(AuthGuard('jwt'))
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
    @Req() req: Request,
    @Param('id') roomId: string,
    @Body() dto: SendChatDto,
  ): Promise<Message> {
    return this.chatService.sendChat(req.user.id, roomId, dto);
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
  async createRoom(
    @Req() req: Request,
    @Body() dto: CreateChatRoom,
  ): Promise<ChatRoom> {
    return this.chatService.crateChatRoom(req.user.id, dto);
  }

  @Get('room/:roomId')
  @ApiOperation({
    description: 'Get chat room by id',
    summary: 'Get chat room by id',
  })
  async getChatRoomById(@Param('roomId') id: string): Promise<ChatRoom> {
    return this.chatService.getChatRoomById(id);
  }

  @Get('room/:roomId/dm/friend')
  async getFriendNameByDMId(
    @Req() req: Request,
    @Param('roomId') roomId: string,
  ): Promise<string> {
    return this.chatService.getFriendNameByDMId(req.user.id, roomId);
  }

  @Get('room/log/:roomId')
  @ApiOperation({
    description: 'Get chat logs of specified chat room',
    summary: 'Get chat logs',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The chat logs',
    type: SwaggerMessages,
  })
  async getChatLogByRoomId(@Param('roomId') id: string): Promise<Message[]> {
    return this.chatService.getChatLogByRoomId(id);
  }

  @ApiOperation({
    description: 'Add a specific user to join a specific room as a member',
    summary: 'Add a user to join a room',
  })
  @Post('member/add')
  async addMember(@Body() dto: AddMemberDto): Promise<Member> {
    return this.chatService.addMember(dto.userId, dto.roomId, dto.status);
  }

  @ApiOperation({
    description: 'Get all DM rooms to which the user belongs',
    summary: "Get a user's DM rooms ",
  })
  @Get('dm')
  async getUserDM(@Req() req: Request): Promise<ChatRoomPayload> {
    return this.chatService.getUserDM(req.user.id);
  }

  /**
   * Channel Controller
   */
  @Get('group')
  @ApiOperation({
    description: 'get channel user belongs to',
    summary: 'get channel user belongs to',
  })
  async getChannels(@Req() req: Request): Promise<ChatRoom[]> {
    return this.chatService.getChannels(req.user.id);
  }

  @Patch('channel/mute')
  @ApiOperation({
    description: 'admin or owner mute the member',
    summary: 'admin or owner mute the member',
  })
  async muteMember(@Req() req: Request, @Body() dto: MemberDto): Promise<Msg> {
    return this.chatService.muteMember(req.user.id, dto);
  }

  @Delete('member/kick')
  @ApiOperation({
    description: 'admin or owner kick the member',
    summary: 'admin or owner kick the member',
  })
  async deleteMember(
    @Req() req: Request,
    @Body() dto: MemberDto,
  ): Promise<Msg> {
    return this.chatService.deleteMember(req.user.id, dto);
  }
}
