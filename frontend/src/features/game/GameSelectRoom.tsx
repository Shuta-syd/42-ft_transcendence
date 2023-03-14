import React, { useEffect, useState, ChangeEvent} from "react";
import {Game, User} from "../../types/PrismaType";
import fetchGameRoomArr from "../../hooks/game/useGameObserver";
import {GameObserverReq, useGameUser} from "../../hooks/game/useGameuser";
import {GameSocket} from "../../contexts/WebsocketContext";

const GameSelectRoom = () => {

    const [tmpNumber, setTmpNumber] = useState<string>('');
    const [number, setNumber] = useState<string>('');
    const [IsAssigned, setIsAsssigned] = useState<boolean>(false);
    let isAlreadyAssigned = false;

    const [user, setUser] = useState<User>();
    const UserPromises = useGameUser();
    useEffect(() => {
        UserPromises.then((userDto: User) => {
            setUser(userDto);
            GameSocket.emit('JoinRoom', userDto.name);
        });
    }, []);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTmpNumber(event.target.value);

    };

    const handleButtonClick = () => {
        setNumber(tmpNumber);
        isAlreadyAssigned = true;
        if (!isAlreadyAssigned && user) {
           const gameRes = GameObserverReq(user.name);
           gameRes.then((game:Game) => {
               if (game.id && game.player1 && game.player2)
                   setIsAsssigned(true);
               }
           );
        }
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
                {IsAssigned && <p>You are successfully assigned !!</p>}
                <p>You are in {number}！</p>
            </div>
        </div>
    )
}

export default GameSelectRoom;
