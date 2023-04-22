import { Module } from '@nestjs/common';
import { PongGateway } from './pong.gateway';
import { PongService } from './pong.service';
import { PongController } from './pong.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [PongGateway, PongService, PrismaService],
  controllers: [PongController],
})
export class PongModule {}
