import React from "react";
import { Link } from "react-router-dom";

const GameMatching = () => (
        <div>
            <h1>[Matching Page]</h1>
            <h2>Who are you?</h2>
            <Link to={"/game/player1"}>Player1</Link>
            <p></p>
            <Link to={"/game/player2"}>Player2</Link>
            <p></p>
            <Link to={"/game/select_room"}>Observer</Link>
            <p></p>
            <Link to={"/game/game_room"}>Random Match</Link>
            <p></p>
            <Link to={"/game/invite_room"}>Invite someone</Link>
            <p></p>
        </div>
    )

export default GameMatching;
