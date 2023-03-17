import axios from "axios";
import {InviteGame} from "../../types/PrismaType";

function GameInviteRoomReq(playerName: { name: string; roomId: string }) {
    const getInviteGameObject = async () => {
        const { data } = await axios.post<InviteGame>(`http://localhost:8080/game/create_invite_room`, {
            playerName,
        });
        return data;
    }
    return getInviteGameObject();

}

export default GameInviteRoomReq ;
