import axios from "axios";
import {InviteGame} from "../../types/PrismaType";

function GameInvitedGuestReq(playerName: { name: string; roomId: string }) {
    const getInviteGameObject = async () => {
        const { data } = await axios.post<InviteGame>(`http://localhost:8080/game/invited_guest`, {
            playerName,
        });
        return data;
    }
    return getInviteGameObject();

}

export default GameInvitedGuestReq ;
