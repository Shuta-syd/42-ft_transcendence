import { Injectable, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Game, Match, InviteGame } from '@prisma/client';
import { assignGuestDto, assignObserverDto, Terminate } from './dto/game.dto';
import { v4 as uuidv4 } from 'uuid';

let playerId = 0;
let tmpGame: Game;
let player2Count = 0;

export type NameToRoomIdDic = { [key: number]: string };
export const NameToRoomIdDic: NameToRoomIdDic = {};

export type NameToInviteRoomIdDic = { [key: string]: string };
export const NameToInviteRoomIdDic: NameToInviteRoomIdDic = {};

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}
  async handleAssignPlayerReq(playerName: string): Promise<Game> {
    const isPlayer2Unique = await this.prisma.game.findFirst({
      where: {
        player2: playerName,
      },
    });
    const isPlayer1Unique = await this.prisma.game.findFirst({
      where: {
        player1: playerName,
      },
    });
    if (isPlayer2Unique) {
      return isPlayer2Unique;
    } else if (isPlayer1Unique) {
      return isPlayer1Unique;
    }
    playerId += 1;
    if (playerId % 2 != 0) {
      const game = this.prisma.game.create({
        data: {
          player1: playerName,
          player2: 'player2_' + uuidv4().toString(),
        },
      });
      player2Count++;
      // ここの処理は改善できそう
      tmpGame = await game;
      game.then((Gamedto: Game) => {
        NameToRoomIdDic[playerName.toString()] = Gamedto.id.toString();
      });
      return game;
    } else {
      const existingGame = await this.prisma.game.findUnique({
        where: {
          id: tmpGame.id,
        },
      });
      if (!existingGame) {
        return existingGame;
      }
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
    if (NameToInviteRoomIdDic[assignObserver.name] !== undefined) {
      delete NameToInviteRoomIdDic[assignObserver.name];
    }
    NameToRoomIdDic[assignObserver.name.toString()] =
      assignObserver.roomId.toString();
    const [game] = await this.prisma.game.findMany({
      where: {
        id: assignObserver.roomId.valueOf(),
      },
    });
    return game || null;
  }
  async getObserverGame(observerName: string): Promise<Game | null> {
    const roomId = NameToRoomIdDic[observerName];
    const [game] = await this.prisma.game.findMany({
      where: {
        id: roomId,
      },
    });
    return game || null;
  }

  async createInviteGame(
    assignPlayerReqDto: string,
  ): Promise<InviteGame | null> {
    const jsonString = JSON.stringify(assignPlayerReqDto);
    const tmp = JSON.parse(jsonString);
    const playerName = tmp.playerName;
    const isPlayer1Unique = await this.prisma.inviteGame.findFirst({
      where: {
        player1: playerName,
      },
    });
    if (isPlayer1Unique) {
      return isPlayer1Unique;
    }
    console.log(playerName, 'inviteGame');
    const game = this.prisma.inviteGame.create({
      data: {
        player1: playerName,
        player2: 'player2_' + uuidv4().toString(),
      },
    });
    player2Count++;
    game.then((Gamedto: InviteGame) => {
      NameToInviteRoomIdDic[playerName.toString()] = Gamedto.id.toString();
    });
    return game;
  }
  async assignGuest(guestDto: assignGuestDto): Promise<InviteGame | null> {
    const IscorrectRoomId = await this.prisma.inviteGame.findFirst({
      where: {
        id: guestDto.roomId,
      },
    });
    if (IscorrectRoomId === null) {
      return IscorrectRoomId;
    }
    NameToInviteRoomIdDic[guestDto.name] = guestDto.roomId;
    const game = await this.prisma.inviteGame.update({
      where: {
        id: guestDto.roomId,
      },
      data: {
        player2: guestDto.name,
      },
    });
    return game || null;
  }

  async terminateGame(dto: Terminate): Promise<Game | InviteGame | null> {
    if (dto.isInviteGame === false) {
      const existingGame1 = await this.prisma.game.findUnique({
        where: {
          player1: dto.player,
        },
      });
      const existingGame2 = await this.prisma.game.findUnique({
        where: {
          player2: dto.player,
        },
      });
      if (!existingGame2 && !existingGame1) {
        return null;
      }
      let game: Game | null = null;
      if (existingGame1) {
        game = await this.prisma.game.delete({
          where: {
            player1: dto.player,
          },
        });
      } else if (existingGame2) {
        game = await this.prisma.game.delete({
          where: {
            player2: dto.player,
          },
        });
      }
      if (game) {
        delete NameToRoomIdDic[game.player1];
        delete NameToRoomIdDic[game.player2];
      }
      return game;
    } else {
      const existingGame1 = await this.prisma.inviteGame.findUnique({
        where: {
          player1: dto.player,
        },
      });
      const existingGame2 = await this.prisma.inviteGame.findUnique({
        where: {
          player2: dto.player,
        },
      });
      if (!existingGame2 && !existingGame1) {
        return null;
      }
      let game: InviteGame | null = null;
      if (existingGame1) {
        game = await this.prisma.inviteGame.delete({
          where: {
            player1: dto.player,
          },
        });
      } else if (existingGame2) {
        game = await this.prisma.inviteGame.delete({
          where: {
            player2: dto.player,
          },
        });
      }
      if (game) {
        delete NameToInviteRoomIdDic[game.player1];
        delete NameToInviteRoomIdDic[game.player2];
      }
      return game;
    }
  }
}
