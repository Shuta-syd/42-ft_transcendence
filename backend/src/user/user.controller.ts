import {
  Body,
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
    console.log('=>', req.user.id);
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
    console.log('user.image => ', data.image);
    return this.userService.addUserImage(req.user.id, data.image);
  }
  @Get('image')
  async getUserImage(@Req() req: Request): Promise<string> {
    return this.userService.getUserImage(req.user.id);
  }
}
