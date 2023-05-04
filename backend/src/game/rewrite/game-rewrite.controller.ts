import {
  Body,
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
import { GameIdDto } from './game-rewrite.dto';

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
  @ApiResponse({
    status: 404,
    description: 'There is no random game room available.',
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
  @ApiResponse({
    status: 403,
    description: 'This room is already full.',
  })
  @ApiResponse({
    status: 404,
    description: 'There is no available room',
  })
  async joinInviteGameAsPlayer2(
    @Req() req: Request,
    @Body() data: GameIdDto,
  ): Promise<InviteGame> {
    return this.gameService.JoinInviteGameAsPlayer2({
      invitedPlayerName: req.user.name,
      roomId: data.roomId,
    });
  }

  @Delete('random-game')
  @ApiOperation({ summary: 'Delete a random game room' })
  @ApiResponse({
    status: 200,
    description: 'The random game room has been successfully deleted.',
  })
  @ApiResponse({
    status: 403,
    description: 'The user is not participating in this game.',
  })
  @ApiResponse({
    status: 404,
    description: 'The invite game was not found.',
  })
  async deleteRandomGame(
    @Req() req: Request,
    @Body() data: GameIdDto,
  ): Promise<Game> {
    const room = await this.prisma.game.findUnique({
      where: {
        id: parseInt(data.roomId),
      },
    });
    if (!room) {
      throw new NotFoundException('Random Game Room not found');
    }
    return this.gameService.DeleteRandomGameRoom({
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
    status: 403,
    description: 'Your not room owner or player of this game.',
  })
  @ApiResponse({
    status: 404,
    description: 'The invite game was not found.',
  })
  async deleteInviteGame(
    @Req() req: Request,
    @Body() data: GameIdDto,
  ): Promise<InviteGame> {
    const room = await this.prisma.inviteGame.findUnique({
      where: {
        id: data.roomId,
      },
    });
    if (!room) {
      throw new NotFoundException('Random Game Room not found');
    }
    return this.gameService.DeleteInviteGameRoom({
      playerName: req.user.name,
      roomId: room.id.toString(),
    });
  }
}
