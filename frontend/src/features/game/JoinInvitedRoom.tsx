import React, {ChangeEvent, useEffect, useState} from "react";
import { Link } from "react-router-dom";
import {User, InviteGame} from "../../types/PrismaType";
import {useGameUser} from "../../hooks/game/useGameuser";
import GameInvitedGuestReq from "../../hooks/game/useInvitedRoom";

const JoinInvitedRoom = () => {

    const [tmpNumber, setTmpNumber] = useState<string>('');
    const [roomId, setRoomid] = useState<string>('');
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
        setRoomid((tmpNumber));
        if ( user?.name) {
            const observseDto = {
                name:user.name,
                roomId,
            }
            // at the beginning, roomId is 0, so escaped
            if (observseDto.roomId === '')
                return
            const gameRes = GameInvitedGuestReq(observseDto);
            gameRes.then((game:InviteGame) => {
                    setIsAsssigned(true);
                }
            );
        }
    };

    return (
        <div>
            <div>
                <p>Invite IDを入力してください！</p>
                <input type="text" value={tmpNumber} onChange={handleInputChange} />
                <button onClick={handleButtonClick}>enter</button>
                {IsAssigned && <p>You are successfully assigned !!</p>}
                {IsAssigned && <Link to={"/game/observer"}>lets go!</Link>}
                <p>You are in {roomId}！</p>
            </div>
        </div>
    )
};

export default JoinInvitedRoom;