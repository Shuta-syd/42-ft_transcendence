import React, {ChangeEvent, useState} from 'react';
import {Link} from 'react-router-dom';
import {Grid} from '@mui/material';
import {Socket} from 'socket.io-client';
import {InviteGame, User} from '../../types/PrismaType';
import GameInvitedGuestReq from '../../hooks/game/useInvitedRoom';

const JoinInvitedRoom = (props: { socket: Socket, user: User }) => {
    const {user} = props;
    const [isButtonVisible, setIsButtonVisible] = useState<boolean>(true);
    const [tmpNumber, setTmpNumber] = useState<string>('');
    const [roomId, setRoomid] = useState<string>('');
    const [IsAssigned, setIsAsssigned] = useState<boolean>(false);
    const [IsUncorrect, setIsUncorrect] = useState<boolean>(false);
    const [Game, setgame] = useState<InviteGame>();

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTmpNumber(event.target.value);
    };

    const handleButtonClick = () => {
        setRoomid(tmpNumber);
        if (user?.name !== undefined) {
            const observseDto = {
                name: user.name,
                roomId,
            };
            // at the beginning, roomId is 0, so escaped
            if (observseDto.roomId === '') return;
            const gameRes = GameInvitedGuestReq(observseDto);
            gameRes.then((game: InviteGame | null) => {
                if (game && game?.player1) {
                    setgame(game);
                    setIsAsssigned(true);
                    setIsUncorrect(false);
                    setIsButtonVisible(false);
                } else {
                    setIsUncorrect(true);
                }
            });
        }
    };

    return (
        <div
            style={{
                backgroundColor: "#EDF0F4",
                minHeight: "100vh",
                backgroundSize: "cover",
            }}
        >
            <div>
                <h1>[Guest Room]</h1>
                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    style={{minHeight: "100vh"}}
                    direction="column"
                >
                    {isButtonVisible && (
                        <Grid item container justifyContent="center">
                            <h2
                                style={{
                                    fontSize: "2rem",
                                }}
                            >
                                Please enter your Invite ID😄
                            </h2>
                            <br/>
                        </Grid>
                    )}
                    {isButtonVisible && (
                        <Grid container justifyContent="center">
                            <input
                                type="text"
                                style={{
                                    borderRadius: "100px",
                                    fontSize: "2rem",
                                }}
                                value={tmpNumber}
                                onChange={handleInputChange}
                            />
                            <button
                                onClick={handleButtonClick}
                                style={{
                                    borderRadius: "100px",
                                    fontSize: "2rem",
                                }}
                            >
                                enter
                            </button>
                        </Grid>
                    )}
                    {IsAssigned && (
                        <h2
                            style={{
                                borderRadius: "100px",
                                fontSize: "4rem",
                            }}
                        >
                            You are successfully assigned !!
                        </h2>
                    )}
                    {IsUncorrect && (
                        <h2
                            style={{
                                borderRadius: "100px",
                                fontSize: "4rem",
                            }}
                        >
                            ID was WRONG!!
                        </h2>
                    )}
                    {IsAssigned && (
                        <Link
                            style={{
                                borderRadius: "100px",
                                fontSize: "4rem",
                            }}
                            to={"/game-rewrite/player2"}
                        >
                            lets go!
                        </Link>
                    )}
                    {IsAssigned && (
                        <h2
                            style={{
                                borderRadius: "100px",
                                fontSize: "4rem",
                            }}
                        >
                            You will fight against {Game?.player1}！
                        </h2>
                    )}
                </Grid>
            </div>
        </div>
    );
};

export default JoinInvitedRoom;

