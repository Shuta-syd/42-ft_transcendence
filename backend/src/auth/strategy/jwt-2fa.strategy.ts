import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class Jwt2FaStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          let jwt = null;
          if (req && req.cookies) {
            jwt = req.cookies['access_token'];
          }
          return jwt;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  /**
   * @description 二要素がオン、オフどちらにも使える
   * @param payload JWTトークンの中身
   * @returns ユーザー
   */
  async validate(payload: {
    sub: string;
    name: string;
    isTwoFactorActive: boolean;
  }): Promise<User> {
    const { sub, isTwoFactorActive } = payload;
    const user = await this.prisma.user.findUnique({
      where: {
        id: sub,
      },
    });
    if (!user || (user.isTwoFactorEnabled && !isTwoFactorActive)) {
      throw new UnauthorizedException(
        'Two-factor authentication is enabled for this user, but no two-factor',
      );
    }
    return user;
  }
}
