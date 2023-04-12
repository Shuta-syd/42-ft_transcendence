import React, { useEffect, useState, ChangeEvent} from "react";
import {Link} from "react-router-dom";
import { Grid } from "@mui/material";
import { Game, User } from "../../types/PrismaType";
import { fetchGameRoomArr } from "../../hooks/game/useGameObserver";
import {GameObserverReq, useGameUser} from "../../hooks/game/useGameuser";

const GameSelectRoom = () => {
    const [tmpNumber, setTmpNumber] = useState<string>('');
    const [number, setNumber] = useState<number>(0);
    const [IsAssigned, setIsAsssigned] = useState<boolean>(false);

    const [user, setUser] = useState<User>();
    const UserPromises = useGameUser();
    useEffect(() => {
        UserPromises.then((userDto: User) => {
            setUser(userDto);
        });
    }, []);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTmpNumber(event.target.value);

    };

    const handleButtonClick = () => {
        setNumber(Number(tmpNumber));
        if ( user?.name) {
            const observseDto = {
                name:user.name,
                roomId:number,
            }
            // at the beginning, roomId is 0, so escaped
            if (observseDto.roomId === 0)
                return
            const gameRes = GameObserverReq(observseDto);
            gameRes.then((game:Game) => {
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
        <div
            style={{
                backgroundColor: "#EDF0F4",
                minHeight: "100vh",
                backgroundSize: "cover",
            }}
        >
            <h2>
            <h1>[Room List]</h1>
            </h2>
            <Grid
                container
                justifyContent="center"
                marginTop="-5%"
                alignItems="center"
                style={{ minHeight: "100vh" }}
                fontSize="h5.fontSize"
            >
            <h1>
            {GameRoomArr.map((game) => (
                <div key={game.id}>
                    <h2>[{game.id}] {game.player1} vs {game.player2}</h2>
                </div>
            ))}
            <div>
                <input
                    type="text"
                    style={{
                        borderRadius: "100px",
                        fontSize: "3rem",
                    }}
                    value={tmpNumber}
                    onChange={handleInputChange} />
                <button
                    onClick={handleButtonClick}
                    style={{
                        borderRadius: "100px",
                        fontSize: "3rem",
                }}
                >enter</button>
                <p
                    style={{
                        fontSize: "2rem",
                    }}
                >※ Please enter the button at least 2 times!</p>
                {IsAssigned && <p>You are successfully assigned !!</p>}
                {IsAssigned && <Link
                    to={"/game/observer"}>lets go! room{number}!!</Link>}
            </div>
            </h1>
            </Grid>
        </div>
    )
}

export default GameSelectRoom;
