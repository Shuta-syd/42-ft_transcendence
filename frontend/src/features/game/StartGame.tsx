import React, {useEffect, useState} from "react";
import {User} from "../../types/PrismaType";
import useGameUser from "../../hooks/game/useGameuser";

const StartGame = () => {

    const [user, setUser] = useState<User>();
    const UserPromises = useGameUser();
    useEffect(() => {
        UserPromises.then((userDto: User) => {
            setUser(userDto);
        });
    }, [UserPromises]);

    return (
        <div>
            <h1>[Start Game]</h1>
            <h2>You are {user?.name}!!!</h2>
            <h2>Wating for someone </h2>
            <p></p>
        </div>
    )
}

export default StartGame;
