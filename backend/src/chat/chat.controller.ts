import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatRoom, Member, Message } from '@prisma/client';
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
  MuteMemberDto,
  CreateChatRoom,
  SendChatDto,
  MemberDto,
  LeaveMemberDto,
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

  @Post('dm/room')
  @ApiOperation({
    description: 'create chat dm room',
    summary: 'create chat dm room',
  })
  async createDMRoom(
    @Req() req: Request,
    @Body() dto: CreateChatRoom,
  ): Promise<{ room: ChatRoom; isNew: boolean }> {
    return this.chatService.crateDMRoom(req.user.name, req.user.id, dto);
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
    return this.chatService.addMember(dto.userId, dto);
  }

  @ApiOperation({
    description: 'Add login user to join a specific room as a member',
    summary: 'Add a user to join a room',
  })
  @Post('member/add/me')
  async addMemberMe(
    @Req() req: Request,
    @Body() dto: AddMemberDto,
  ): Promise<ChatRoom> {
    const me = await this.chatService.addMember(req.user.id, dto);
    return this.getChatRoomById(me.roomId);
  }

  @ApiOperation({
    description: 'search my member in room',
    summary: 'search my member in room',
  })
  @Get(':roomId/myMember')
  async getMyMember(
    @Req() req: Request,
    @Param('roomId') roomId: string,
  ): Promise<Member> {
    return this.chatService.getMyMember(req.user.id, roomId);
  }

  @ApiOperation({
    description: 'Get all DM rooms to which the user belongs',
    summary: "Get a user's DM rooms ",
  })
  @Get('dm')
  async getUserDM(@Req() req: Request): Promise<ChatRoom[]> {
    return this.chatService.getUserDM(req.user.id);
  }

  /**
   * Channel Controller
   */
  @Get('channel')
  @ApiOperation({
    description: 'get channel user belongs to',
    summary: 'get channel user belongs to',
  })
  async getChannels(@Req() req: Request): Promise<ChatRoom[]> {
    return this.chatService.getChannels(req.user.id);
  }

  @Get('channel/search')
  @ApiOperation({
    description: 'get channel related to name',
    summary: 'get channel related to name',
  })
  async searchChannel(
    @Req() req: Request,
    @Query('name') name: string,
  ): Promise<ChatRoom[]> {
    return this.chatService.searchChannel(req.user.id, name);
  }

  @Patch('channel/member/mute')
  @ApiOperation({
    description: 'admin or owner mute the member',
    summary: 'admin or owner mute the member',
  })
  async muteMember(@Req() req: Request, @Body() dto: MuteMemberDto) {
    return this.chatService.muteMember(req.user.id, dto);
  }

  @Delete('channel/member/kick')
  @ApiOperation({
    description: 'admin or owner kick the member',
    summary: 'admin or owner kick the member',
  })
  async deleteMember(@Req() req: Request, @Body() dto: MemberDto) {
    return this.chatService.deleteMember(req.user.id, dto);
  }

  @Post('channel/member/ban')
  @ApiOperation({
    description: 'admin or owner ban the user',
    summary: 'admin or owner ban the user',
  })
  async banUserOnChatRoom(
    @Req() req: Request,
    @Body() dto: MemberDto,
  ): Promise<Msg> {
    return this.chatService.banUserOnChatRoom(req.user.id, dto);
  }

  @Delete('channel/member/leave')
  @ApiOperation({
    description: 'the user leave the room',
    summary: 'the user leave the room',
  })
  async leaveChatRoom(
    @Req() req: Request,
    @Body() dto: LeaveMemberDto,
  ): Promise<Msg> {
    return this.chatService.leaveChatRoom(req.user.id, dto);
  }

  @Patch('channel/role')
  async updateMemberRole(@Req() req: Request, @Body() dto: MemberDto) {
    return this.chatService.updateMemberRole(req.user.id, dto);
  }
}
