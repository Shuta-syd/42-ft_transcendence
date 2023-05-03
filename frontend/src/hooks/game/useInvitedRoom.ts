import axios from "axios";
import {GuestDto, InviteGame} from "../../types/PrismaType";

function GameInvitedGuestReq(guest: GuestDto) {
    const getInviteGameObject = async () => {
        const { data } = await axios.post<InviteGame>(`http://localhost:8080/game-rewrite/invite-game/player2`, guest);
        return data;
    }
    return getInviteGameObject();

}

export default GameInvitedGuestReq ;
