import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {Game, Match} from '@prisma/client';
import {assignObserverDto} from "./dto/game.dto";
import {addAbortSignal} from "stream";

let playerId = 0;
let tmpGame: Game;

export type NameToRoomIdDic = { [key: number]: string };
export const NameToRoomIdDic: NameToRoomIdDic = {};
@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}
  async handleAssignPlayerReq(
    assignPlayerReqDto: string,
  ): Promise<Game | null> {
    playerId += 1;
    const jsonString = JSON.stringify(assignPlayerReqDto);
    const tmp = JSON.parse(jsonString);
    const playerName = tmp.playerName;
    if (playerId % 2 != 0) {
      const game = this.prisma.game.create({
        data: {
          player1: playerName,
          player2: '',
        },
      });
      // ここの処理は改善できそう
      tmpGame = await game;
      game.then((Gamedto: Game) => {
        NameToRoomIdDic[playerName.toString()] = Gamedto.id.toString();
        console.log(playerName.toString());
        console.log(Gamedto.id.toString());
        console.log(Gamedto.id.toString());
        console.log(NameToRoomIdDic[playerName]);
      });
      return game;
    } else {
      const game = this.prisma.game.update({
        where: {
          id: tmpGame.id,
        },
        data: {
          player2: playerName,
        },
      });
      game.then((Gamedto: Game) => {
        NameToRoomIdDic[playerName.toString()] = Gamedto.id.toString();
        console.log(playerName.toString());
        console.log(Gamedto.id.toString());
        console.log(Gamedto.id.toString());
        console.log(NameToRoomIdDic[playerName]);
      });
      return game;
    }
  }
  async getAllOngoingGames(): Promise<Game[] | null> {
    return await this.prisma.game.findMany({});
  }
  async assignObserver(
    assignObserver: assignObserverDto,
  ): Promise<Game | null> {
    console.log(assignObserver.name);
    NameToRoomIdDic[assignObserver.name.toString()] =
      assignObserver.roomId.toString();
    const [game] = await this.prisma.game.findMany({
      where: {
        id: assignObserver.roomId.valueOf(),
      },
    });
    return game || null;
  }
}
