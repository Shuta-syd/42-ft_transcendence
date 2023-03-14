import React, {useEffect, useState} from "react";
import {Game} from "../../types/PrismaType";
import fetchGameRoomArr from "../../hooks/game/useGameObserver";

const GameSelectRoom = () => {


    const [GameRoomArr, setGameRoomArr] = useState<Game[]>([]);
    const GameRoomPromises = fetchGameRoomArr();
    useEffect(() => {
        GameRoomPromises.then((games: Game[]) => {
            setGameRoomArr(games);
        });
    }, [GameRoomPromises]);

    return (
        <div>
            <h1>[Match Result]</h1>
            {GameRoomArr.map((game) => (
                <div key={game.id}>
                    <h2>[{game.id}] {game.player1} vs {game.player2}</h2>
                </div>
            ))}
        </div>
    )
}
export default GameSelectRoom;
