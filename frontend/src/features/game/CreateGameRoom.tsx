import React, {useEffect, useState, useRef} from "react";
import {Game, User} from "../../types/PrismaType";
import useGameUser, { GameRoomReq } from '../../hooks/game/useGameuser';

const CreateGameRoom = () => {

    const [user, setUser] = useState<User>();
    const [game, setGame] = useState<Game>();
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
        });
    }, [user]);

    return (
        <div>
            <h1>[Create Game]</h1>
            <h2>You are {user?.name}!!!</h2>
            <h2>You are in {game?.id}!!!</h2>

            <h2>Wating for someone </h2>
            <p></p>
        </div>
    )
}

export default CreateGameRoom;
