import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { User, InviteGame } from "../../types/PrismaType";
import { GameInviteRoomReq, useGameUser } from "../../hooks/game/useGameuser";

const InviteRoom = () => {
    const [user, setUser] = useState<User>();
    const [roomId, setRoomId] = useState<string | undefined>(undefined);

    const gamePromisesRef = useRef<Promise<InviteGame>>();
    const userPromise = useGameUser();

    useEffect(() => {
        userPromise.then((userDto: User) => {
            setUser(userDto);
            gamePromisesRef.current = GameInviteRoomReq(userDto?.name);
        });
    }, []);

    useEffect(() => {
        gamePromisesRef.current?.then((Gamedto: InviteGame) => {
            setRoomId(Gamedto?.id);
        });
    }, [user]);

    const [text, setText] = useState("");

    function handleCopy() {
        navigator.clipboard.writeText(text);
    }

    useEffect(() => {
        setText(`You have been invited by ${user?.name} to ${roomId}! Let's join now!\n`);
    }, [user, roomId]);

    return (
        <div>
            <h1>[Host Room!!]</h1>
            <h2>You are {user?.name}!!!</h2>
            <h2>Invite Id is {roomId}!!!</h2>
            <p></p>
            <p>{text}</p>
            <button onClick={handleCopy}>Copy Text</button>
            <p></p>
            <div>
                <Link to={"/game/player1"}>Player1</Link>
                <p></p>
            </div>
        </div>
    );
};

export default InviteRoom;