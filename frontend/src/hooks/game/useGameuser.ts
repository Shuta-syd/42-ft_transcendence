import axios from "axios";
import { User, Game } from "../../types/PrismaType";

    /*
    id: string
    email: string
    name: string
    front側からはUser自信の情報を判定することができなかったため、
    endpointに対して、get methodを送って、上の情報を受け取る
    */

function useGameUser() {
    const getGameUser = async () => {
        const { data } = await axios.get<User>(`http://localhost:8080/user`);
        return data;
    }
    return getGameUser();
}

function GameRoomReq(playerName: string | undefined) {
    const getGameObject = async () => {
        const { data } = await axios.post<Game>(`http://localhost:8080/game/newplayer`, {
            playerName,
        });
        return data;
    }
    return getGameObject();

}
type ObserverDto = {
    name: string;
    roomId: string,
}

function GameObserverReq(observer: ObserverDto | undefined) {
    const getGameObject = async () => {
        const { data } = await axios.post<Game>(`http://localhost:8080/game/newobserver`, {
            observer
        });
        return data;
    }
    return getGameObject();
}
export {useGameUser, GameRoomReq, GameObserverReq};
