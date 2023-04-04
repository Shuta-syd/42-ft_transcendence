import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, SignUpUserDto } from './dto/auth.dto';
import { Jwt } from './type/auth.type';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const asyncScrypt = promisify(scrypt);

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  /**
   * @param dto 作成するUserデータ
   * @returns 作成したUserデータ
   */
  async signupUser(dto: SignUpUserDto): Promise<Jwt> {
    let hashedPassword: string;
    const emailExit = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (emailExit) {
      throw new NotAcceptableException('This email is already in use');
    }
    const userNameExit = await this.prisma.user.findUnique({
      where: { name: dto.name },
    });

    if (userNameExit) {
      throw new NotAcceptableException('This userName is already in use');
    }

    const salt = randomBytes(8).toString('hex');
    if (dto.isFtLogin !== true) {
      const hash = (await asyncScrypt(dto.password, salt, 32)) as Buffer;
      hashedPassword = hash.toString() + '.' + salt;
    }
    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: dto.password ? hashedPassword : '',
        name: dto.name,
        image: dto.image,
        isFtLogin: dto.isFtLogin ? dto.isFtLogin : false,
      },
    });

    return this.generateJwt(newUser.id, newUser.name);
  }

  /**
   * @description ユーザログインするための関数
   * @param dto ログインするユーザ情報
   */
  async login(dto: AuthDto): Promise<Jwt> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (user.isFtLogin) new BadRequestException('Please login with 42');
    if (!user) throw new NotFoundException("user couldn't be found");

    const [storedHash, salt] = user.password.split('.');

    const hashedPassword = (await asyncScrypt(
      dto.password,
      salt,
      32,
    )) as Buffer;

    if (!user.isFtLogin && storedHash !== hashedPassword.toString())
      throw new NotAcceptableException('password is wrong');
    return this.generateJwt(user.id, user.name);
  }

  /**
   * @description Jwt Tokenを生成するための関数
   */
  async generateJwt(
    userId: string,
    name: string,
    isTwoFactorActive = false,
  ): Promise<Jwt> {
    const payload = {
      sub: userId,
      name,
      isTwoFactorActive,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '30m',
      secret: secret,
    });

    return {
      accessToken: token,
    };
  }

  async validateUser(userDto: SignUpUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: userDto.email,
      },
    });
    if (user) {
      return user;
    }

    await this.signupUser({ ...userDto, isFtLogin: true });
    return this.prisma.user.findUnique({
      where: {
        email: userDto.email,
      },
    });
  }

  /**
   * Two Factor Authentication
   */

  /**
   * @description 二要素認証するためのシークレットを作成する
   * @param user 二要素認証するユーザー
   * @returns シークレットとURL
   */
  async createOtpAuthUrl(user: User): Promise<string> {
    const secret = authenticator.generateSecret();

    const otpAuthUrl = authenticator.keyuri(
      user.name,
      this.config.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
      secret,
    );

    // secretをデータベースに保存
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        twoFactorSecret: secret,
      },
    });

    return otpAuthUrl;
  }

  /**
   * @description otpAuthUrlのQRコードを生成する
   * @param stream
   * @param otpAuthUrl
   * @returns QRcode
   */
  async pipeQrCodeStream(stream: Response, otpAuthUrl: string) {
    return toFileStream(stream, otpAuthUrl);
  }

  async turnOnOtp(user: User) {
    // userからsecretを取得するのではなく、データベースから取得したい

    // 二要素が無効
    if (!user.twoFactorSecret || user.twoFactorSecret === '') {
      throw new BadRequestException('OneTimePasswordAuth is inactivate.');
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isTwoFactorEnabled: true,
      },
    });

    return this.generateJwt(user.id, user.name, true);
  }

  async turnOffOtp(user: User) {
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isTwoFactorEnabled: false,
        twoFactorSecret: null,
      },
    });

    return this.generateJwt(user.id, user.name, false);
  }

  async validateOtp(user: User, otpCode: string) {
    // userからsecretを取得するのではなく、データベースから取得したい
    // 二要素認証がオフ
    if (!user.isTwoFactorEnabled) {
      throw new BadRequestException('Two-Factor-Auth OFF.');
    }

    if (!user.twoFactorSecret || user.twoFactorSecret === '') {
      throw new BadRequestException('OneTimePassword is inactivate.');
    }

    const isCodeValid = authenticator.verify({
      token: otpCode,
      secret: user.twoFactorSecret,
    });
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
  }
}
