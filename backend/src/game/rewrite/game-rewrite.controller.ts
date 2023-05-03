import {
  Controller,
  Delete,
  NotFoundException,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { GameReWriteService } from './game-rewrite.service';
import { AuthGuard } from '@nestjs/passport';
import { Game, InviteGame } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('game-rewrite')
@UseGuards(AuthGuard('jwt'))
export class GameReWriteController {
  constructor(
    private readonly gameService: GameReWriteService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('random-game/player')
  @ApiOperation({ summary: 'Create or join a random game as a player' })
  @ApiResponse({
    status: 201,
    description: 'The game has been successfully created or joined.',
  })
  async createOrJoinRandomGameAsPlayer(@Req() req: Request): Promise<Game> {
    return this.gameService.createOrJoinRandomGameAsPlayer(req.user.name);
  }

  @Post('random-game')
  @ApiOperation({ summary: 'Create a random game room' })
  @ApiResponse({
    status: 201,
    description: 'The random game room has been successfully created.',
  })
  async createRandomGame(@Req() req: Request): Promise<Game> {
    return this.gameService.createRandomGameRoom(req.user.name);
  }

  @Post('invite-game')
  @ApiOperation({ summary: 'Create an invite game room' })
  @ApiResponse({
    status: 201,
    description: 'The invite game room has been successfully created.',
  })
  async createInviteGame(@Req() req: Request): Promise<InviteGame> {
    return this.gameService.createInviteGameRoom(req.user.name);
  }

  @Patch('random-game/player2')
  @ApiOperation({ summary: 'Join a random game as player 2' })
  @ApiResponse({
    status: 200,
    description: 'Successfully joined a random game as player 2.',
  })
  async joinRandomeGameAsPlayer2(@Req() req: Request): Promise<Game> {
    return this.gameService.JoinRandomGameAsPlayer2(req.user.name);
  }

  @Patch('invite-game/player2')
  @ApiOperation({ summary: 'Join an invite game as player 2' })
  @ApiResponse({
    status: 200,
    description: 'Successfully joined an invite game as player 2.',
  })
  async joinInviteGameAsPlayer2(@Req() req: Request): Promise<InviteGame> {
    return this.gameService.JoinInviteGameAsPlayer2(req.user.name);
  }

  @Delete('random-game')
  @ApiOperation({ summary: 'Delete a random game room' })
  @ApiResponse({
    status: 200,
    description: 'The random game room has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'The invite game was not found.',
  })
  async deleteRandomGame(@Req() req: Request) {
    const room = await this.prisma.game.findUnique({
      where: {
        player1: req.user.name,
      },
    });
    if (!room) {
      throw new NotFoundException('Random Game Room not found');
    }
    await this.gameService.DeleteRandomGameRoom({
      playerName: req.user.name,
      roomId: room.id.toString(),
    });
  }

  @Delete('invite-game')
  @ApiOperation({ summary: 'Delete an invite game room' })
  @ApiResponse({
    status: 200,
    description: 'The invite game room has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'The invite game was not found.',
  })
  async deleteInviteGame(@Req() req: Request) {
    const room = await this.prisma.inviteGame.findUnique({
      where: {
        player1: req.user.name,
      },
    });
    if (!room) {
      throw new NotFoundException('Random Game Room not found');
    }
    await this.gameService.DeleteInviteGameRoom({
      playerName: req.user.name,
      roomId: room.id.toString(),
    });
  }
}
