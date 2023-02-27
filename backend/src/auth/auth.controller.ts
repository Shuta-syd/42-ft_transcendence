import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { PrismaUser } from 'src/swagger/type';
import { SignUpUserDto } from 'src/user/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({
    description: 'create user',
    summary: 'create user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The created the user',
    type: PrismaUser,
  })
  async signupUser(@Body() userData: SignUpUserDto): Promise<User> {
    return this.authService.signupUser(userData);
  }
}
