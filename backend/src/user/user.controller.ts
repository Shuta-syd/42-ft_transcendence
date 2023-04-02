import {
  Body,
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
import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import { PrismaUser, SwaggerFriends } from 'src/swagger/type';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AcceptFriend, FriendReq } from './dto/user.dto';

@ApiTags('user')
@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @ApiOperation({
    description: 'find user by userId',
    summary: 'find user by userId',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found the user',
    type: PrismaUser,
  })
  getUser(@Req() req: Request): User {
    return req.user;
  }

  @Patch('friend')
  @ApiOperation({
    description:
      'Adding a user with a friendID to the friend list of a user with userID',
    summary: 'Friend Request',
  })
  async addFriend(
    @Req() req: Request,
    @Body() data: { friendId: string },
  ): Promise<User> {
    return this.userService.addFriend(req.user.id, data.friendId);
  }

  @Get('friend')
  @ApiOperation({
    description: 'Get the friend list of the userID user',
    summary: "get user's friends",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "The user's friends",
    type: SwaggerFriends,
  })
  async getFriend(@Req() req: Request): Promise<User[]> {
    return this.userService.getFriend(req.user.id);
  }

  @Delete('friend')
  @ApiOperation({
    description: 'delete friend',
    summary: 'delete friend',
  })
  async deleteFriend(
    @Req() req: Request,
    @Body() data: { friendId: string },
  ): Promise<User> {
    this.userService.deleteFriend(data.friendId, req.user.id);
    return this.userService.deleteFriend(req.user.id, data.friendId);
  }

  @Post('friendReq')
  @ApiOperation({
    description: 'send a Friend Request',
  })
  async SetFriendReq(
    @Req() reqBody: Request,
    @Body() friendId: AcceptFriend,
  ): Promise<string[]> {
    return this.userService.handleFriendReq(reqBody.user.id, friendId.friendId);
  }

  @Get('friendReq')
  @ApiOperation({
    description: 'check the friend req of the name of user',
  })
  async checkFriendReq(@Req() req: Request): Promise<string[] | null> {
    if (req.user.name) {
      return this.userService.getFriendReqs(req.user.id);
    }
    return null;
  }

  @Patch('friendReq')
  @ApiOperation({
    description: 'accept friend request and add friend',
  })
  async SetFriendR(
    @Req() req: Request,
    @Body() friendId: AcceptFriend,
  ): Promise<User> {
    return this.userService.acceptFriendreq(req.user.id, friendId.friendId);
  }

  @Delete('friendReq')
  @ApiOperation({
    description: 'delete friend request',
  })
  async deleteFriendR(
    @Req() req: Request,
    @Body() friendId: AcceptFriend,
  ): Promise<User> {
    return this.userService.rejectFriendReq(req.user.id, friendId.friendId);
  }

  @Get('friend/search')
  async searchFriend(
    @Req() req: Request,
    @Query('name') name: string,
  ): Promise<User[]> {
    return this.userService.searchFriend(req.user.id, name);
  }
  @Post('add/image')
  async addUserImage(
    @Req() req: Request,
    @Body() data: { image: string },
  ): Promise<User> {
    return this.userService.addUserImage(req.user.id, data.image);
  }
  @Get('image')
  async getUserImage(@Req() req: Request): Promise<string> {
    return this.userService.getUserImage(req.user.id);
  }
}
