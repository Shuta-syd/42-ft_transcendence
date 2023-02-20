import { Body, Get, Param, Patch, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { SignUpUserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserById(@Param('id') userId: string): Promise<User | null> {
    return this.userService.getUserById(parseInt(userId));
  }

  @Post()
  async signupUser(@Body() userData: SignUpUserDto): Promise<User> {
    return this.userService.signupUser(userData);
  }

  @Patch('friend')
  async addFriend(
    @Body() data: { userId: string; friendId: string },
  ): Promise<User> {
    return this.userService.addFriend(
      parseInt(data.userId),
      parseInt(data.friendId),
    );
  }

  @Get('friend/:id')
  async getFriend(@Param('id') userId: string): Promise<User[]> {
    return this.userService.getFriend(parseInt(userId));
  }
}
