import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserGateway } from './user.gateway';

@Module({
  imports: [PrismaModule],
  providers: [UserService, UserGateway],
  controllers: [UserController],
})
export class UserModule {}
