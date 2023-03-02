import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Response } from 'express';
import { PrismaUser } from 'src/swagger/type';
import { SignUpUserDto } from 'src/user/dto/user.dto';
import { AuthService } from './auth.service';
import { AuthDto, Msg } from './dto/auth.dto';

@ApiTags('auth')
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

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'login user',
    summary: 'login user',
  })
  async login(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Msg> {
    const jwt = await this.authService.login(dto);
    res.cookie('access_token', jwt.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });
    return {
      message: 'Login Success',
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'logout user',
    summary: 'logout user',
  })
  async logout(@Res({ passthrough: true }) res: Response): Promise<Msg> {
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      path: '/',
    });
    return {
      message: 'Logout Success',
    };
  }
}
