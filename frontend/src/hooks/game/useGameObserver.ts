import axios from "axios";
import {Game, User} from "../../types/PrismaType";
/*
axiosを使ってbackend(nestjs)とhttp通信を行う
またaxios.getとすることでGetメソッドをリクエストとして指定できる
バックエンド側では@Getのように指定することで特定のメソッドに対して、
レスポンスを送ることができる
 */

function fetchGameRoomArr() {
    const getGames = async () => {
        const { data } = await axios.get<Game[]>(`http://localhost:8080/game/ongoing`);
        return data;
    }
    return getGames();
}

function fetchObserverGameinfo(user: User) {
    const getGame = async () => {
        const { data } = await axios.get<Game>(`http://localhost:8080/game/observer`, {
            params: {
                name: user.name,
            }
        });
        return data;
    }
    return getGame();
}

export { fetchGameRoomArr, fetchObserverGameinfo };
