import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { FtStrategy } from './strategy/ft.strategy';
import { Jwt2FaStrategy } from './strategy/jwt-2fa.strategy';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [PrismaModule, ConfigModule, UserModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    FtStrategy,
    Jwt2FaStrategy,
  ],
})
export class AuthModule {}
