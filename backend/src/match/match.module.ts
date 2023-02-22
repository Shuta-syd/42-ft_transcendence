import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import {PrismaService} from "../prisma/prisma.service";

@Module({
  imports: [PrismaService],
  controllers: [MatchController],
  providers: [MatchService]
})
export class MatchModule {}

