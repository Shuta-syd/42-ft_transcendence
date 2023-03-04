import React from "react";
import { Link } from "react-router-dom";

const GameMatching = () => {
    console.log('start');
    return (
    <div>
        <h1>[Matching Page]</h1>
        <h2>Who are you?</h2>
        <Link to={"/game/player1"}>Player1</Link>
        <p></p>
        <Link to={"/game/player2"}>Player2</Link>
        <p></p>
        <Link to={"/game/observer"}>Observer</Link>
        <p></p>
        <Link to={"/game/CreateGameRoom"}>CreateGameRoom</Link>
        <p></p>
    </div>
    )
}

export default GameMatching;
