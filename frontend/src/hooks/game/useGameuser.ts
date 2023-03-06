import axios from "axios";
import { User, Game} from "../../types/PrismaType";

function useGameUser() {
    const getMatches = async () => {
        const { data } = await axios.get<User>(`http://localhost:8080/user`);
        return data;
    }
    return getMatches();
}

function GameRoomReq(playerName: string | undefined) {
        const getMatches = async () => {
            const { data } = await axios.post<Game>(`http://localhost:8080/game/newplayer`, {
                playerName,
            });
            return data;
        }
        return getMatches();
}

export default useGameUser;
export { GameRoomReq };
