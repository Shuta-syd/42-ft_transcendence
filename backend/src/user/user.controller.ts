import { Body, Param, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async signupUser(
    @Body() userData: { name: string; email: string; password: string },
  ): Promise<User> {
    return this.userService.createUser(userData);
  }

  @Post('friend/:id')
  async follow(
    @Param('id') friendId: string,
    @Body() user: { userId: number },
  ): Promise<User> {
    return this.userService.addFriend(user, friendId);
  }
}
