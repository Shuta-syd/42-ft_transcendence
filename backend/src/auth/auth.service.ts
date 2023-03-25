import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpUserDto } from 'src/user/dto/user.dto';
import { AuthDto } from './dto/auth.dto';
import { Jwt } from './type/auth.type';

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
  async signupUser(dto: SignUpUserDto): Promise<User> {
    // メールアドレスが既に存在するかどうかを確認する
    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (userExists) {
      // 既に存在する場合は、エラーをスローするか、処理を中断する
      throw new Error('このメールアドレスは既に使用されています。');
    }

    // 存在しない場合は、新しいユーザーを作成する
    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: dto.password,
        name: dto.name,
        // その他の必要なフィールドを追加する
      },
    });

    return newUser;
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
    if (!user) throw new Error("user couldn't be found");
    if (user.password !== dto.password) throw new Error('password is wrong');
    return this.generateJwt(user.id, user.name);
  }

  /**
   * @description Jwt Tokenを生成するための関数
   */
  async generateJwt(userId: string, name: string): Promise<Jwt> {
    const payload = {
      sub: userId,
      name,
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
    return this.signupUser(userDto);
  }
}
