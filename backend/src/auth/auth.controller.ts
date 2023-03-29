import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Response } from 'express';
import { PrismaUser } from 'src/swagger/type';
import { SignUpUserDto } from 'src/user/dto/user.dto';
import { AuthService } from './auth.service';
import { AuthDto, Msg } from './dto/auth.dto';
import { Request } from 'express';
import { FtGuard } from './guards/ft.guard';

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
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const jwt = await this.authService.login(dto);
    return res.cookie('access_token', jwt.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });
  }

  @Get('login/42')
  @UseGuards(FtGuard)
  login42() {
    return 'login42auth';
  }

  @Get('login/42/callback')
  @UseGuards(FtGuard)
  async ftCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const username = req.user.name;
    const userId = req.user.id;
    const jwt = await this.authService.generateJwt(userId, username);
    res.cookie('access_token', jwt.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });
    res.redirect('http://localhost:3000/user');
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
      sameSite: 'lax',
      path: '/',
    });
    return {
      message: 'Logout Success',
    };
  }
}
