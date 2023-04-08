import React from "react";
import {useParams} from "react-router-dom";
import GamePlayer1 from "./GamePlayer1";
import GamePlayer2 from "./GamePlayer2";
import GameObserver from "./GameObserver";
import GameSelectRoom from "./GameSelectRoom";
import CreateGameRoom from "./CreateGameRoom";
import InviteRoom from "./InviteRoom";
import JoinInvitedRoom from "./JoinInvitedRoom";


const GameRouting = () => {
    const {room} = useParams();
    if (room === 'player1') {
        return <GamePlayer1 />
    }
    if (room === 'player2') {
        return <GamePlayer2 />
    }
    if (room === 'observer') {
        return <GameObserver />
    }
    if (room === 'select_room') {
        return <GameSelectRoom />
    }
    if (room === 'game_room') {
        return <CreateGameRoom />
    }
    if (room === 'invite_room') {
        return <InviteRoom />
    }
    if (room === 'join_invited_room') {
        return <JoinInvitedRoom />
    }

    return <div>
        <h1>
        THIS PAGE IS NOT FOUND
        </h1>
    </div>
}

export default GameRouting;
