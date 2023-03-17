import axios from "axios";

type GuestDto = {
    name: string
    roomId: string
}
function GameInvitedRoomReq(guest: GuestDto) {
    const getGame = async () => {
        const { data } = await axios.post<GuestDto>(`http://localhost:8080/game/invited_guest`, guest);
        return data;
    }
    return getGame();
}

export default  GameInvitedRoomReq ;
