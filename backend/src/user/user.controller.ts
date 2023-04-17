import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PrismaUser, SwaggerFriends } from 'src/swagger/type';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AcceptFriend, UserDto } from './dto/user.dto';

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

  @Get('other')
  @ApiOperation({
    description: 'find other user by userId',
    summary: 'find other user by userId',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found the other user',
    type: PrismaUser,
  })
  async getUserById(@Query('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Get('other/friend')
  @ApiOperation({
    description: 'find friend by other person userId',
    summary: 'find friend by other person userId',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found the other user',
    type: PrismaUser,
  })
  async getFriendById(@Query('id') id: string): Promise<User[]> {
    return this.userService.getFriend(id);
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
    await this.userService.deleteFriend(data.friendId, req.user.id);
    return this.userService.deleteFriend(req.user.id, data.friendId);
  }

  /**
   * friendReq
   */
  @Post('friendReq')
  @ApiOperation({
    description: 'send a Friend Request',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user send a friend request',
    type: PrismaUser,
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user get a friend request',
    type: PrismaUser,
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user accept a friend request',
    type: PrismaUser,
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user decline a friend request',
    type: PrismaUser,
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

  @Get('name')
  async searchFriendByName(@Query('name') name: string): Promise<User> {
    return this.userService.searchFriendByName(name);
  }

  /**
   * Block
   */
  @ApiOperation({
    summary: 'Check if a user is blocked',
    description: 'Determine whether the specified user ID is blocked.',
  })
  @ApiResponse({
    status: 200,
    description: 'A boolean value indicating if the user is blocked',
  })
  @ApiResponse({
    status: 400,
    description: 'The specified user ID is not a valid UUID',
  })
  @ApiResponse({
    status: 404,
    description: 'The specified user ID does not exist',
  })
  @Get('block/:userId')
  async isUserBlocked(
    @Req() req: Request,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<boolean> {
    return this.userService.isUserBlocked(req.user.id, userId);
  }

  @ApiOperation({
    summary: 'Block a user',
    description: 'Adds the specified user ID to the block list.',
  })
  @ApiResponse({
    status: 200,
    description: 'Block successful',
    type: UserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'The user is trying to block themselves',
  })
  @ApiResponse({
    status: 404,
    description: 'Specified user ID not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Block relationship already exists',
  })
  @Post('block/:userId')
  @HttpCode(HttpStatus.OK)
  async blockUser(
    @Req() req: Request,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<User> {
    return this.userService.blockUser(req.user.id, userId);
  }

  @ApiOperation({
    summary: 'Unblock a user',
    description: 'Removes the specified user ID from the block list.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the unblocked user',
    type: UserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'The user is trying to unblock themselves',
  })
  @ApiResponse({
    status: 404,
    description: 'Specified user ID not found or block relationship not found',
  })
  @Delete('block/:userId')
  @HttpCode(HttpStatus.OK)
  async unblockUser(
    @Req() req: Request,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<User> {
    return this.userService.unblockUser(req.user.id, userId);
  }

  @ApiOperation({
    summary: 'Get the block list of a user',
    description: 'Retrieve the block list for the specified user ID.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns an array of users included in the block list for the specified user ID',
    type: [UserDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Specified user ID not found',
  })
  @Get('block')
  async getBlockList(@Req() req: Request): Promise<User[]> {
    return this.userService.getBlockList(req.user.id);
  }
}
