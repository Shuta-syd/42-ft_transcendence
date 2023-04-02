import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Response } from 'express';
import { PrismaUser } from 'src/swagger/type';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { FtGuard } from './guards/ft.guard';
import { AuthDto, Msg, OtpCodeDao, SignUpUserDto } from './dto/auth.dto';
import { Jwt2FaGuard } from './guards/jwt-2fa.guard';
import { APP_FILTER } from '@nestjs/core';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  @UsePipes(new ValidationPipe())
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
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'login user',
    summary: 'login user',
  })
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const jwt = await this.authService.login(dto);
    res.cookie('access_token', jwt.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });
    return;
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

  /**
   * Two Factor Authentication
   */

  @Post('otp')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(201)
  @ApiOperation({
    description: 'QRコードの元となるURLを作成',
    summary: 'QRコードの元となるURLを作成',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'QR',
  })
  async createOtpAuthUrl(@Req() req: Request): Promise<string> {
    return await this.authService.createOtpAuthUrl(req.user);
  }

  @Patch('otp/on')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    description: '二要素認証を有効にする',
    summary: '二要素認証を有効にする',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '二要素オンメッセージ',
    type: Msg,
  })
  async turnOnOtp(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Msg> {
    const jwt = await this.authService.turnOnOtp(req.user);

    res.cookie('access_token', jwt.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });

    return { message: 'One-Time-Password ON' };
  }

  @Patch('otp/off')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    description: '二要素認証を無効にする',
    summary: '二要素認証を無効にする',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '二要素オフメッセージ',
    type: Msg,
  })
  async turnOffOtp(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Msg> {
    const jwt = await this.authService.turnOffOtp(req.user);

    res.cookie('access_token', jwt.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });

    return { message: 'One-Time-Password OFF' };
  }

  @Post('otp/validation')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    description:
      'ワンタイムパスワードをバリデーション, 2回目以降のログインに利用する',
    summary: 'ワンタイムパスワードをバリデーション',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ワンタイムパスワード成功',
  })
  async validateOtp(@Req() req: Request, @Body() { otpcode }: OtpCodeDao) {
    return this.authService.validateOtp(req.user, otpcode);
  }

  @Get('otp/test')
  @HttpCode(200)
  @UseGuards(Jwt2FaGuard)
  @ApiOperation({
    description: 'Jwt2FaGuardのテストエンドポイント',
    summary: 'Jwt2FaGuardのテストエンドポイント',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '二要素成功メッセージ',
    type: Msg,
  })
  async test2fa(): Promise<Msg> {
    return {
      message: '2FA Success, or 2FA OFF',
    };
  }
}
