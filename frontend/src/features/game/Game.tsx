import React from "react";
// import ReactDOM from "react-dom";

type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
interface Properties<T, U> {
    display: T;
    flexDirection?: FlexDirection;
    justifyContent?: U;
}

const inner: Properties<'flex', 'center'> = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
}

const ROW_SIZE = 10;
const COL_SIZE = 20;
const board : number[] = [...Array(ROW_SIZE * COL_SIZE).map(() => 0)];

const style = {
    width: "250px",
    heigth: "250px",
    display: "grid",
    gridTemplate: `repeat(${ROW_SIZE}, 1fr) / repeat(${COL_SIZE}, 1fr)`
}

function Game() {
    return (
        <div id='scoreboard'>
            <h1 id='title'>3D PONG</h1>
            {/* start new logic */}
            <div style={inner}>

            </div>
            {/* end new logic */}
            <div id="gameCanvas" />
            <h2 id='scores'>0-0</h2>
            <h2 id='winnerBoard'>First to 7, wins!!!!</h2>
            <br/>
        </div>
    );
}

export default Game;
