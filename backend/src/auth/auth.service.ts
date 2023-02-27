import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpUserDto } from 'src/user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  /**
   * @param dto //今後Dtoに変更する可能性大
   * @returns 作成したUserのデータ
   */
  async signupUser(dto: SignUpUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...dto,
      },
    });
  }
}
