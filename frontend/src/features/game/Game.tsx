import React from "react";
import './Game.css';



function Game() {
    return (
        <div id='scoreboard'>
            <h1 id='title'>3D PONG</h1>
            <div id="gameCanvas" />
            <h2 id='scores'>0-0</h2>
            <h2 id='winnerBoard'>First to 7, wins!!!!</h2>
            <br/>
        </div>
    );
}

export default Game;
