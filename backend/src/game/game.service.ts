import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { assignPlayerReq, assignPlayerRes } from './dto/game.dto';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}
  async handleAssignPlayerReq(dto: assignPlayerReq): Promise<assignPlayerRes | null> {

  }

}
