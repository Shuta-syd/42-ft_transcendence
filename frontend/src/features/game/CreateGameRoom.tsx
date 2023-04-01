import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Grid } from "@mui/material";
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

    const ShowPositions = () => {
        if (user?.name) {
            return (
                <div>
                    <h2>You are in {roomId}!!!</h2>
                    <h2>Player1 is {game?.player1}!!!</h2>
                    {showPlayer2()}
                </div>
            );
        }
        return (
            <div>
                Your session is expired. Please login again...
            </div>
        );
    }


    return (
        <div
            style={{
                backgroundColor: "#EDF0F4",
                minHeight: "100vh",
                backgroundSize: "cover",
            }}
        >
            <h2>
            <h1>[Random Match Room]</h1>
            </h2>
            <Grid
                container
                justifyContent="center"
                marginTop="-5%"
                alignItems="center"
                style={{ minHeight: "100vh" }}
                fontSize="h4.fontSize"
                direction="column"
            >
                <Grid mr={10} spacing={50}>
                <h3>
                    <ShowPositions />
            <h1>Your Room 👉 {ShowPage()} !!!</h1>
                </h3>
                </Grid>
                <Grid mr={10} spacing={10}>
            <button
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "80px",
                width: "100px",
                fontSize: "20px",
                color: "green"
            }}
                onClick={handleClick}>Exit Room</button>
                </Grid>
            </Grid>
        </div>
    );

};

export default CreateGameRoom;
