import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Game, User } from "../../types/PrismaType";
import { GameRoomReq, useGameUser } from "../../hooks/game/useGameuser";
import { GameSocket } from "../../contexts/WebsocketContext";

const CreateGameRoom = () => {
    const [user, setUser] = useState<User>();
    const [game, setGame] = useState<Game>();
    const [roomId, setRoomId] = useState<number | undefined>(undefined); // useStateでroomIdを宣言

    const gamePromisesRef = useRef<Promise<Game>>();
    const UserPromises = useGameUser();
    useEffect(() => {
        UserPromises.then((userDto: User) => {
            setUser(userDto);
            gamePromisesRef.current = GameRoomReq(userDto?.name);
        });
    }, []);

    useEffect(() => {
        gamePromisesRef.current?.then((Gamedto: Game) => {
            setGame(Gamedto);
            setRoomId(Gamedto?.id); // roomIdを更新する
        });
    }, [user]);

    const handleClick = () => {
        GameSocket.emit('TerminateGame', user?.name);
    };

    const ShowPage = () => {
        if (game?.player1 !== user?.name) {
            return (
                    <Link to={"/game/player2"}>Player2</Link>
            );
        }
        return (
                <Link to={"/game/player1"}>Player1</Link>
        );
    }

    function showPlayer2() {
        const compare: string = 'player2_'
        if (game?.player2.substring(0, 8) === compare.substring(0, 8)) {
            return (
                <h2>Player2: Loading</h2>
            )
        }
            return (
                <h2>Player2: {game?.player2}!!!</h2>
            )

    }

    return (
        <div>
            <h1>[Random Match Room!!]</h1>
            <h2>You are {user?.name}!!!</h2>
            <h2>You are in {roomId}!!!</h2>
            <h2>Player1: {game?.player1}!!!</h2>
            {showPlayer2()}
            <h1>Your Room 👉 {ShowPage()} !!!</h1>
            <button onClick={handleClick}>Exit Room</button>
        </div>
    );

};

export default CreateGameRoom;
