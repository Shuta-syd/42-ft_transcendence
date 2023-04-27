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
import { AuthDto, FtUpdateUserDto, SignUpUserDto } from './dto/auth.dto';
import { Jwt } from './type/auth.type';
import { randomBytes, randomUUID, scrypt } from 'crypto';
import { promisify } from 'util';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { AlreadyInUseException } from './exception/AlreadyInUseException';
import { TokenExpiredError } from 'jsonwebtoken';
import { createHash } from 'crypto';
import { UserService } from 'src/user/user.service';

const asyncScrypt = promisify(scrypt);

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly userService: UserService,
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
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

    if (userNameExit && dto.isFtLogin !== true) {
      throw new NotAcceptableException('This userName is already in use');
    } else if (userNameExit && dto.isFtLogin === true) {
      throw new AlreadyInUseException(
        '42 username is already in use',
        dto.name,
      );
    }

    const mb = (await this.calcImageSize(dto.image)) / 1024;
    if (mb > 10) {
      throw new NotAcceptableException(
        'This image is too large. max size is 10MB',
      );
    }

    const salt = randomBytes(8).toString('hex');
    if (dto.isFtLogin !== true) {
      const hash = (await asyncScrypt(dto.password, salt, 32)) as Buffer;
      hashedPassword = hash.toString('base64') + '.' + salt;
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

    const tokens = await this.generateJwt(newUser.id, newUser.name);

    return tokens;
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

    if (!user.isFtLogin && storedHash !== hashedPassword.toString('base64'))
      throw new NotAcceptableException('password is wrong');
    return this.generateJwt(user.id, user.name);
  }

  /**
   * @description ログアウトするための関数
   */
  async logout(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRefreshToken: null,
      },
    });
  }

  async signup42User(dto: SignUpUserDto): Promise<User> {
    let newUser: User;

    const domain = dto.email.split('@')[1];

    const hashedEmail =
      createHash('sha256').update(dto.email).digest('hex').toString() +
      `@${domain}`;

    do {
      const uuidName = randomUUID();
      newUser = await this.prisma.user.create({
        data: {
          name: uuidName,
          password: '',
          email: hashedEmail,
          image: dto.image,
          isFtLogin: true,
          Ftlogined: false,
        },
      });
    } while (newUser === undefined || newUser === null);

    return newUser;
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
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '30m',
      secret: secret,
    });

    const refreshSecret = this.config.get('JWT_REFRESH_SECRET');
    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: refreshSecret,
    });

    // リフレッシュトークンをハッシュ化
    const salt = randomBytes(8).toString('hex');
    const hash = (await asyncScrypt(refreshToken, salt, 32)) as Buffer;
    const hashedRefreshToken = hash.toString('base64') + '.' + salt;

    // ハッシュ化したリフレッシュトークンをDBに保存
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRefreshToken,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(userDto: SignUpUserDto): Promise<User> {
    const domain = userDto.email.split('@')[1];

    const hashedEmail =
      createHash('sha256').update(userDto.email).digest('hex').toString() +
      `@${domain}`;

    const user = await this.prisma.user.findUnique({
      where: {
        email: hashedEmail,
      },
    });
    if (user) {
      return user;
    }

    const newUser = await this.signup42User(userDto);

    return newUser;
  }

  async updateFtUser(userId: string, dto: FtUpdateUserDto): Promise<User> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userNameExit = await this.prisma.user.findUnique({
      where: { name: dto.name },
    });

    if (userNameExit && userNameExit.id !== userId) {
      throw new NotAcceptableException('This username is already in use');
    }

    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: dto.name,
        image: dto.image,
        Ftlogined: true,
      },
    });
  }

  /**************************
   *****  Refresh token *****
   **************************/

  /**
   * @description 提供されたリフレッシュトークンを検証し、新しいアクセストークンを生成します。
   * @param userId アクセストークンを生成する必要があるユーザーID
   * @param refreshToken 検証する必要があるリフレッシュトークン
   * @returns 提供されたリフレッシュトークンが有効である場合は新しいアクセストークン、そうでない場合はエラーをスロー
   */
  async refreshAccessToken(userId: string, refreshToken: string): Promise<Jwt> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new Error("user couldn't be found");

    // データベースに保存されているリフレッシュトークンと一致するか判定
    const isValidRefreshToken = await this.verifyRefreshToken(
      user,
      refreshToken,
    );
    if (!isValidRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // リフレッシュトークンをデコード
    const decoded = await this.decodeRefreshToken(refreshToken);
    if (!decoded) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.generateJwt(decoded.sub, decoded.name);
  }

  private async verifyRefreshToken(
    user: User,
    refreshToken: string,
  ): Promise<boolean> {
    // データベースに保存されているハッシュかされたリフレッシュトークンを取得
    const [storedHashedRefreshToken, salt] = user.hashedRefreshToken.split('.');

    // リフレッシュトークンが一致するか判定
    const hashedRefreshToken = (await asyncScrypt(
      refreshToken,
      salt,
      32,
    )) as Buffer;
    return storedHashedRefreshToken === hashedRefreshToken.toString('base64');
  }

  private async decodeRefreshToken(refreshToken: string) {
    try {
      return this.jwt.verify(refreshToken, {
        secret: this.config.get(`JWT_REFRESH_SECRET`),
      });
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token expired');
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /*****************************
   * Two Factor Authentication *
   *****************************/

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

  async convertURLToBase64(imageUrl: string): Promise<string> {
    const response$ = this.httpService
      .get(imageUrl, { responseType: 'arraybuffer' })
      .pipe(map((res) => Buffer.from(res.data, 'binary').toString('base64')));
    const base64 = await lastValueFrom(response$);
    return 'data:image/jpeg;base64,' + base64;
  }

  async calcImageSize(base64: string): Promise<number> {
    const decoded = Buffer.from(base64, 'base64');
    return decoded.length / 1024;
  }
}
