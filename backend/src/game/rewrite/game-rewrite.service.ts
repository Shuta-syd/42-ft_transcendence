/* eslint-disable prettier/prettier */
import { Injectable, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Game, Match, InviteGame } from '@prisma/client';
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
    // 'player2'の文字列がある場合はまだplayer2が参加していないから空いていることを示す

    // ない場合はcreateRandomGameRoom();

    // ある場合は JoinRandomGameAsPlayer2

    // 上記で参加もしくは作成したGameを返り値として返す
    return null;
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
    // ある場合はその値を返す
    // awaitして同期処理に変更 thenは使用しない

    // 作成済みのゲームがない場合は新たに作成する
    // player1は引数の変数、player2は’player2_’+ uuidv4()
    // awaitして同期処理に変更 thenは使用しない

    // userNameToRandomGameRoomIdに登録

    // 作成したランダムゲームを返す
    return null;
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
      }
    });
    if (isExit) return isExit;

    /**
     * inviterをplayer1として新たなinviteGameデータをprismaで作成
     */
    const newGameRoom = await this.prisma.inviteGame.create({
      data: {
        player1: inviterName,
        player2: 'player2_' + uuidv4(),
      }
    })

    /**
     * ここの部分は違和感を感じる
     * グローバル変数で怪しい。ここをどうにか変更するのが良さそう
     */
    // NameToInviteRoomIdDic[inviterName] = newGameRoom.id;
    return newGameRoom;
  }

  /**
   * @description
   * player2としてRandom Gameに参加する（Gameデータベースを上書きする）
   */
  async JoinRandomGameAsPlayer2(playerName: string): Promise<Game> {
    // prisma.findFirstでplayer2プロパティに'player2'の文字列が入ったレコード1つ取り出す
    // 'player2'の文字列がある場合はまだplayer2が参加していないから空いていることを示す

    // 取得したレコードのdata: player2を引数の変数に変更する prisma.game.update使用
    // where: idで検索
    // ここでの返り値を変数に入れる (1)

    // userNameToRandomGameRoomIdに登録;

    // (1)を返す
    return null;
  }

  /**
   * @description
   * player2としてInvite Gameに参加する（InviteGameデータベースを上書きする）
   */
  async JoinInviteGameAsPlayer2(playerName: string): Promise<InviteGame> {
    // prisma.findUniqueでdto.roomIdの部屋を探す。ない場合は例外をスロー(NotFoundException)
    // player2に既に'player2'を含む文字列以外があった場合は例外スロー(ForbiddenException)
    // ↑すでに参加されているため
    // 'player2'の文字列がある場合はまだplayer2が参加していないから空いていることを示す。そのため、正常に次の処理に移行

    // 取得したレコードのdata: player2を引数の変数に変更する prisma.game.update使用
    // where: idで検索
    // ここでの返り値を変数に入れる (1)

   // userNameToInviteGameRoomIdに登録;

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

    // dto.playerName === データレコード.player1もしくはplayer2の条件分岐
    // 上記がどちらとも当てはまらない場合は例外（ForbiddenException）

    // 正常の場合はprisma.game.deleteで削除

    // userNameToRandomGameRoomIdからも削除 player1 player2両方とも

  }

  /**
   * @description
   * playerNameが属しているInviteGameRoom(database: InviteGame)を削除する
   * 旧terminateGame()を分解している。（分解しているのは簡略化のため）
   */
  async DeleteInviteGameRoom(dto: DeleteGameDto) {
        // dto.roomIdのデータレコードが存在しているかをprisma.findUniqueで検索
    // ない場合は例外投げる（NotFoundException）

    // dto.playerName === データレコード.player1もしくはplayer2の条件分岐
    // 上記がどちらとも当てはまらない場合は例外（ForbiddenException）

    // 正常の場合はprisma.game.deleteで削除

    // userNameToInviteGameRoomIdからも削除 player1 player2両方とも
  }

  getUserNameToRandomGameRoomId() { return this.userNameToRandomGameRoomId; }

  getUserNameToInviteGameRoomId() { return this.userNameToInviteGameRoomId; }

  // Observerは省略してる
}
