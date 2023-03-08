import React, {useEffect, useState, useRef} from "react";
import {Link} from "react-router-dom";
import {Game, User} from "../../types/PrismaType";
import { GameRoomReq, useGameUser } from '../../hooks/game/useGameuser';


// let PlayerType: number;
// let roomId: number;


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
            // if (Gamedto.player2.length === 0)
            //     PlayerType = 1;
            // else
            //     PlayerType = 2;
            // roomId = Gamedto.id;
        });
    }, [user]);


  /*  function Ready() {
        if (PlayerType === 1)
            return(
                <div>
                    <Link to={"/game/player1"}>Player1</Link>
                </div>
            );
        if (PlayerType === 2)
            return (
                <div>
                    <Link to={"/game/player2"}>Player2</Link>
                </div>
            );
    } */
    return (
        <div>
            <h1>[Create Game]</h1>
            <h2>You are {user?.name}!!!</h2>
            <h2>You are in {game?.id}!!!</h2>
            <h2>Player1 is  {game?.player1.toString()}!!!</h2>
            <h2>Player2 is  {game?.player2.toString()}!!!</h2>
            <h2>Wating for someone </h2>
            <div>
                <Link to={"/game/player1"}>Player1</Link>
            </div>
            <div>
                <Link to={"/game/player2"}>Player2</Link>
            </div>
        </div>
    )
}

export default CreateGameRoom;
