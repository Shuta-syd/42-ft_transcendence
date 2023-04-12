import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { JwtStrategy } from './strategy/jwt.strategy';
import { FtStrategy } from './strategy/ft.strategy';
import { Jwt2FaStrategy } from './strategy/jwt-2fa.strategy';

@Module({
  imports: [PrismaModule, ConfigModule, JwtModule.register({}), HttpModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, FtStrategy, Jwt2FaStrategy],
})
export class AuthModule {}
