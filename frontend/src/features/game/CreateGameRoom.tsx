import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Game, User } from "../../types/PrismaType";
import { GameRoomReq, useGameUser } from "../../hooks/game/useGameuser";
import GamePlayer1 from "./GamePlayer1";
import GamePlayer2 from "./GamePlayer2";
import {GameSocket} from "../../contexts/WebsocketContext";

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
            type RoomId = {
                room: string | undefined,
            }
            const roomid: RoomId = {
                room: Gamedto.id.toString(),
            }
            GameSocket.emit('JoinRoom', roomid);
        });
    }, [user]);

    return (
        <div>
            <h1>[Create Game]</h1>
            <h2>You are {user?.name}!!!</h2>
            <h2>You are in {roomId}!!!</h2>
            <h2>Player1 is {game?.player1}!!!</h2>
            <h2>Player2 is {game?.player2}!!!</h2>
            <h2>Waiting for someone </h2>
            <div>
                <Link to={"/game/player1"}>Player1</Link>
                <Link to={"/game/player2"}>Player2</Link>
            </div>
            {
                (() => {
                    if (game?.player2 === '') {
                        return <GamePlayer1 roomId={roomId}></GamePlayer1>
                    }
                    return <GamePlayer2 roomId={roomId}></GamePlayer2>
                })()
            }
        </div>
    );

};

export default CreateGameRoom;
