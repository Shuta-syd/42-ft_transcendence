import React from "react";
import { Link } from "react-router-dom";

const GameMatching = () => (
        <div>
            <h1>[Matching Page]</h1>
            <h1>
            <Link to={"/game/game_room"}>Random Match</Link>
            <p></p>
            <Link to={"/game/invite_room"}>Invite Someone</Link>
            <p></p>
            <Link to={"/game/join_invited_room"}>Join Invited room</Link>
            <p></p>
            <Link to={"/game/select_room"}>Observer</Link>
            </h1>
        </div>
    )

export default GameMatching;
