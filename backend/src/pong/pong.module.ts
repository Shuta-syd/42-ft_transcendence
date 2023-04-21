import { Module } from '@nestjs/common';
import { PongGateway } from './pong.gateway';
import { PongService } from './pong.service';
import { PongController } from './pong.controller';

@Module({
  providers: [PongGateway, PongService],
  controllers: [PongController]
})
export class PongModule {}
