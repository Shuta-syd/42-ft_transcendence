import React from "react";
// import {Link, Routes} from "react-router-dom";
// import {Typography} from "@mui/material";
// import GameObserver from "./GameObserver";
// import GamePlayer2 from "./GamePlayer2";
// import GamePlayer1 from "./GamePlayer1";
//
/*
const GamePlayer1 = () => {
    console.log('I\'m Player1');
    return (
        <div>
            I'm Player1
        </div>
    )
}

const GamePlayer2 = () => {
    console.log('I\'m Player2');
    return (
        <div>
            I'm Player2
        </div>
    )
}

const GameObserver = () => {
    console.log('I\'m Observer');
        return (
            <div>
                I'm Observer
            </div>
        )
}
*/
const GameMatching = () => {
    console.log('start');
    return (
    <div>
        <h1>[Matching Page]</h1>
        {/* <h2>YOU ARE {showPlayerType()}!!</h2> */}
        <h2>Who are you?</h2>
        <a href="http://localhost:3000/game/player1">Player1</a>
        <p></p>
        <a href="http://localhost:3000/game/player2">Player2</a>
        <p></p>
        <a href="http://localhost:3000/game/observer">Observer</a>
        <p></p>

    </div>
    )
}

export default GameMatching;