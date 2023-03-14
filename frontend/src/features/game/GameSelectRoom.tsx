import React, { useEffect, useState, ChangeEvent} from "react";
import {Game} from "../../types/PrismaType";
import fetchGameRoomArr from "../../hooks/game/useGameObserver";

const GameSelectRoom = () => {

    const [tmpNumber, setTmpNumber] = useState<string>('');
    const [number, setNumber] = useState<string>('');


    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTmpNumber(event.target.value);

    };

    const handleButtonClick = () => {
        setNumber(tmpNumber);
    };


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
            <div>
                <input type="text" value={tmpNumber} onChange={handleInputChange} />
                <button onClick={handleButtonClick}>enter</button>
                <p>You are in {number}！</p>
            </div>
        </div>
    )
}

export default GameSelectRoom;
