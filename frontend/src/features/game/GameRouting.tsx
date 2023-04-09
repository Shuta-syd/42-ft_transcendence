import React from "react";
import { Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import useSocket from "../../hooks/useSocket";
import GamePlayer1 from "./GamePlayer1";
import GamePlayer2 from "./GamePlayer2";
import GameObserver from "./GameObserver";
import GameSelectRoom from "./GameSelectRoom";
import CreateGameRoom from "./CreateGameRoom";
import InviteRoom from "./InviteRoom";
import JoinInvitedRoom from "./JoinInvitedRoom";

const GameRouting = () => {
  const { room } = useParams<{ room: string }>();
  const socket: Socket = useSocket("http://localhost:8080/game");

  switch (room) {
    case "player1":
      return <GamePlayer1 socket={socket} />;
    case "player2":
      return <GamePlayer2 socket={socket} />;
    case "observer":
      return <GameObserver socket={socket}/>;
    case "select_room":
      return <GameSelectRoom />;
    case "game_room":
      return <CreateGameRoom socket={socket} />;
    case "invite_room":
      return <InviteRoom socket={socket} />;
    case "join_invited_room":
      return <JoinInvitedRoom socket={socket} />;
    default:
      return (
        <div>
          <h1>THIS PAGE IS NOT FOUND</h1>
        </div>
      );
  }
};

export default GameRouting;
