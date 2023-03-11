import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Game, User } from "../../types/PrismaType";
import { GameRoomReq, useGameUser } from "../../hooks/game/useGameuser";
import GamePlayer1 from "./GamePlayer1";
import GamePlayer2 from "./GamePlayer2";

const CreateGameRoom = () => {
    const [user, setUser] = useState<User>();
    // const [game, setGame] = useState<Game>();
    const [player1, setPlayer1] = useState<String>();
    const [player2, setPlayer2] = useState<String>();
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
            // setGame(Gamedto);
            setPlayer1(Gamedto?.player1);
            setPlayer2(Gamedto?.player2);
            setRoomId(Gamedto?.id); // roomIdを更新する
        });
    }, [user]);

    // return (
    //     <div>
    //         <h1>[Create Game]</h1>
    //         <h2>You are {user?.name}!!!</h2>
    //         <h2>You are in {roomId}!!!</h2>
    //         <h2>Player1 is {game?.player1.toString()}!!!</h2>
    //         <h2>Player2 is {game?.player2.toString()}!!!</h2>
    //         <h2>Waiting for someone </h2>
    //             <Link to={"/game/player1"}>Player1</Link>
    //             <Link to={"/game/player2"}>Player2</Link>
    //         {
    //             (() => {
    //                 if (game?.player2.toString() === '') {
    //                     <GamePlayer1 roomId={roomId}></GamePlayer1>
    //                 } else {
    //                     <GamePlayer2 roomId={roomId}></GamePlayer2>
    //                 }
    //                 }
    //             )
    //         }
    //     </div>
    // );

    return (
        <div>
            <h1>[Create Game]</h1>
            <h2>You are {user?.name}!!!</h2>
            <h2>You are in {roomId}!!!</h2>
            <h2>Player1 is {player1}!!!</h2>
            <h2>Player2 is {player2}!!!</h2>
            <h2>Waiting for someone </h2>
            <div>
                <Link to={"/game/player1"}>Player1</Link>
                <Link to={"/game/player2"}>Player2</Link>
            </div>
            {
                (() => {
                    if (GamePlayer2.toString() == '') {
                        return <GamePlayer1 roomId={roomId}></GamePlayer1>
                    }
                    return <GamePlayer2 roomId={roomId}></GamePlayer2>

                })()
            }
        </div>
    );

};

export default CreateGameRoom;
