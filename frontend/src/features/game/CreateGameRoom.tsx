import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Game, User } from "../../types/PrismaType";
import { GameRoomReq, useGameUser } from "../../hooks/game/useGameuser";

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

    // eslint-disable-next-line consistent-return
    const ShowPage = () => {
        if (!game?.player2) {
            return (
                "Hello"
            );
        }
        return "World"
    }


    return (
        <div>
            <h1>[Random Match Room!!]</h1>
            <h2>You are {user?.name}!!!</h2>
            <h2>You are in {roomId}!!!</h2>
            <h2>Player1 is {game?.player1}!!!</h2>
            <h2>Player2 is {game?.player2}!!!</h2>
            <h1>go next page! {ShowPage()}</h1>
            <div>
                 <h1>
                 <br></br>
                 <Link to={"/game/player2"}>Player2</Link>
                </h1>
            </div>
        </div>
    );

};

export default CreateGameRoom;
