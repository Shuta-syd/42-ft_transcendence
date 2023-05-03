/* eslint-disable prettier/prettier */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Game, InviteGame } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { DeleteGameDto } from './game-rewrite.dto';

@Injectable()
export class GameReWriteService {
  private readonly userNameToRandomGameRoomId = new Map<string, string>();
  private readonly userNameToInviteGameRoomId = new Map<string, string>();

  constructor(private readonly prisma: PrismaService) {}

  /**
   * @description
   * player1側に回ってゲームを作成するかplayer2として参加するかの判断をする関数
   * ランダムゲームに限る
   * 返り値はGame
   */
  async createOrJoinRandomGameAsPlayer(playerName: string): Promise<Game> {
    // prisma.findFirstでplayer2プロパティに'player2'の文字列が入ったレコード1つ取り出す
    const player2NotAssginedGame = await this.prisma.game.findFirst({
      where: {
        player2: {
          contains: 'player2_',
        },
      },
    });

    // 'player2'の文字列がある場合はまだplayer2が参加していないから空いていることを示す
    if (player2NotAssginedGame) {
      // ある場合は JoinRandomGameAsPlayer2
      const game = this.JoinRandomGameAsPlayer2(playerName);
      return game;
    } else {
      // ない場合はcreateRandomGameRoom()
      const game = this.createRandomGameRoom(playerName);
      return game;
    }

    // 上記で参加もしくは作成したGameを返り値として返す
  }

  /**
   * @description
   * player1をassignしてランダムゲームのデータベースを作成して返す
   * すでにassignされているゲームがデータベースにある場合はそれを返す
   *
   * ※ここではplayer2へのassignはしない。その役割はJoinRandomGameAsPlayer2()
   * ランダムゲームとはGameデータベースを指す
   */
  async createRandomGameRoom(player1Name: string): Promise<Game> {
    // すでにassignされているランダムゲームがあるかをprisma.findUniqueで検索
    const prismaGame = await this.prisma.game.findFirst({
      where: {
        OR: [
          {
            player1: player1Name,
          },
          {
            player2: player1Name,
          },
        ],
      },
    });
    // ある場合はその値を返す
    if (prismaGame) return prismaGame;
    // awaitして同期処理に変更 thenは使用しない
    // 作成済みのゲームがない場合は新たに作成する
    // player1は引数の変数、player2は’player2_’+ uuidv4()
    // awaitして同期処理に変更 thenは使用しない
    const game = await this.prisma.game.create({
      data: {
        player1: player1Name,
        player2: 'player2_' + uuidv4(),
      },
    });

    // userNameToRandomGameRoomIdに登録
    this.userNameToRandomGameRoomId.set(player1Name, game.id.toString());
    // 作成したランダムゲームを返す
    return game;
  }

  /**
   * @description
   * inviter(招待する側)をassignしてInviteGameのデータベースを作成して返す
   * すでに作成されているゲームがデータベースにある場合はそれを返す
   */
  async createInviteGameRoom(inviterName: string): Promise<InviteGame> {
    // 既に招待済みのデータベースがあるかをprisma.findUniqueで確認
    const isExit = await this.prisma.inviteGame.findUnique({
      where: {
        player1: inviterName,
      },
    });
    if (isExit) return isExit;

    /**
     * inviterをplayer1として新たなinviteGameデータをprismaで作成
     */
    const newGameRoom = await this.prisma.inviteGame.create({
      data: {
        player1: inviterName,
        player2: 'player2_' + uuidv4(),
      },
    });

    /**
     * ここの部分は違和感を感じる
     * グローバル変数で怪しい。ここをどうにか変更するのが良さそう
     */
    this.userNameToInviteGameRoomId.set(inviterName, newGameRoom.id.toString());
    return newGameRoom;
  }

  /**
   * @description
   * player2としてRandom Gameに参加する（Gameデータベースを上書きする）
   */
  async JoinRandomGameAsPlayer2(playerName: string): Promise<Game> {
    // prisma.findFirstでplayer2プロパティに'player2'の文字列が入ったレコード1つ取り出す
    const player2NotAssginedGame = await this.prisma.game.findFirst({
      where: {
        player2: {
          contains: 'player2_',
        },
      },
    });

    // player1が自分の名前だったら、そのゲームを返す
    if (player2NotAssginedGame.player1 === playerName) {
      return player2NotAssginedGame
    }

    // 'player2'の文字列がある場合はまだplayer2が参加していないから空いていることを示す
    const id = player2NotAssginedGame.id;

    // 取得したレコードのdata: player2を引数の変数に変更する prisma.game.update使用
    const game = await this.prisma.game.update({
      where: {
        id: id,
      },
      data: {
        player2: playerName,
      },
    });
    // ここでの返り値を変数に入れる (1)

    // userNameToRandomGameRoomIdに登録;
    this.userNameToRandomGameRoomId.set(playerName, game.id.toString());

    // (1)を返す
    return game;
  }

  /**
   * @description
   * player2としてInvite Gameに参加する（InviteGameデータベースを上書きする）
   */
  async JoinInviteGameAsPlayer2(playerName: string): Promise<InviteGame> {
    // prisma.findUniqueでdto.roomIdの部屋を探す。ない場合は例外をスロー(NotFoundException)
    const roomId = this.userNameToInviteGameRoomId.get(playerName);
    if (!roomId) throw new NotFoundException('部屋が見つかりませんでした。');

    // player2に既に'player2'を含む文字列以外があった場合は例外スロー(ForbiddenException)
    const prismaPlayer2 = await this.prisma.inviteGame.findUnique({
      where: {
        id: roomId,
      },
    });
    // 'player2'の文字列がある場合はまだplayer2が参加していないから空いていることを示す。そのため、正常に次の処理に移行
    if (prismaPlayer2.player2.slice(0, 8) === 'player2_') {
      throw new ForbiddenException('すでに参加されています。');
    }
    // ↑すでに参加されているため

    // 取得したレコードのdata: player2を引数の変数に変更する prisma.game.update使用
    // where: idで検索
    // ここでの返り値を変数に入れる (1)
    const gmme = await this.prisma.inviteGame.update({
      where: {
        id: roomId,
      },
      data: {
        player2: playerName,
      },
    });

    // userNameToInviteGameRoomIdに登録;
    this.userNameToInviteGameRoomId.set(playerName, gmme.id.toString());
    // (1)を返す
    return null;
  }

  /**
   * @description
   * playerNameが属しているRandomGameRoom(database: Game)を削除する
   * 旧terminateGame()を分解している（分解しているのは簡略化のため）
   */
  async DeleteRandomGameRoom(dto: DeleteGameDto) {
    // dto.roomIdのデータレコードが存在しているかをprisma.findUniqueで検索
    // ない場合は例外投げる（NotFoundException）
    const game = await this.prisma.game.findUnique({
      where: {
        id: parseInt(dto.roomId),
      },
    });
    if (!game) throw new NotFoundException();
    // dto.playerName === データレコード.player1もしくはplayer2の条件分岐
    // 上記がどちらとも当てはまらない場合は例外（ForbiddenException）
    if (dto.playerName !== game.player1 && dto.playerName !== game.player2)
      throw new ForbiddenException();

    // 正常の場合はprisma.game.deleteで削除
    await this.prisma.game.delete({
      where: {
        id: parseInt(dto.roomId),
      },
    });
    // userNameToRandomGameRoomIdからも削除 player1 player2両方とも
    this.userNameToRandomGameRoomId.delete(game.player1);
    this.userNameToRandomGameRoomId.delete(game.player2);
  }

  /**
   * @description
   * playerNameが属しているInviteGameRoom(database: InviteGame)を削除する
   * 旧terminateGame()を分解している。（分解しているのは簡略化のため）
   */
  async DeleteInviteGameRoom(dto: DeleteGameDto) {
    // dto.roomIdのデータレコードが存在しているかをprisma.findUniqueで検索
    const game = await this.prisma.inviteGame.findUnique({
      where: {
        id: dto.roomId,
      },
    });
    // ない場合は例外投げる（NotFoundException）
    if (!game) throw new NotFoundException('部屋が見つかりませんでした。');

    // dto.playerName === データレコード.player1もしくはplayer2の条件分岐
    if (dto.playerName !== game.player1) {
      // 上記がどちらとも当てはまらない場合は例外（ForbiddenException）
      if (dto.playerName !== game.player2) {
        throw new ForbiddenException(
          'あなたはこの部屋の作成者ではありません。',
        );
      }
    }
    // 上記がどちらとも当てはまらない場合は例外（ForbiddenException）

    // 正常の場合はprisma.game.deleteで削除
    await this.prisma.inviteGame.delete({
      where: {
        id: dto.roomId,
      },
    });

    // userNameToInviteGameRoomIdからも削除 player1 player2両方とも
    this.userNameToInviteGameRoomId.delete(game.player1);
    this.userNameToInviteGameRoomId.delete(game.player2);
  }

  getUserNameToRandomGameRoomId() {
    return this.userNameToRandomGameRoomId;
  }

  getUserNameToInviteGameRoomId() {
    return this.userNameToInviteGameRoomId;
  }

  // Observerは省略してる
}
