import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ConfigModule,
    JwtModule.register({}),
    HttpModule,
  ],
  providers: [UserService, AuthService, JwtService],
  controllers: [UserController],
})
export class UserModule {}
