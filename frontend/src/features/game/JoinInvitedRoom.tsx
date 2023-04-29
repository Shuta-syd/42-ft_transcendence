import React, { ChangeEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid } from '@mui/material';
import { Socket } from 'socket.io-client';
import { InviteGame, User } from '../../types/PrismaType';
import { useGameUser } from '../../hooks/game/useGameuser';
import GameInvitedGuestReq from '../../hooks/game/useInvitedRoom';

const JoinInvitedRoom = (props: { socket: Socket }) => {
  const { socket } = props;
  const [tmpNumber, setTmpNumber] = useState<string>('');
  const [roomId, setRoomid] = useState<string>('');
  const [IsAssigned, setIsAsssigned] = useState<boolean>(false);
  const [IsUncorrect, setIsUncorrect] = useState<boolean>(false);
  const [Game, setgame] = useState<InviteGame>();
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
        } else {
          setIsUncorrect(true);
        }
      });
    }
  };

  const handleClick = () => {
    socket.emit('TerminateGame', user?.name);
  };

  return (
    <div
      style={{
        backgroundColor: '#EDF0F4',
        minHeight: '100vh',
        backgroundSize: 'cover',
      }}
    >
      <div>
        <h1>[Guest Room]</h1>
        <Grid
          container
          justifyContent="center"
          marginTop="-5%"
          alignItems="center"
          style={{ minHeight: '100vh' }}
          fontSize="h5.fontSize"
          direction="column"
        >
          <Grid item mr={11} spacing={13}>
            <h2
              style={{
                fontSize: '2rem',
              }}
            >
              Please enter your Invite ID😄
            </h2>
            <br />
          </Grid>
          <p></p>
          <Grid mr={13} spacing={10}>
            <input
              type="text"
              style={{
                borderRadius: '100px',
                fontSize: '2rem',
              }}
              value={tmpNumber}
              onChange={handleInputChange}
            />
            <button
              onClick={handleButtonClick}
              style={{
                borderRadius: '100px',
                fontSize: '2rem',
              }}
            >
              enter
            </button>
          </Grid>
          {IsAssigned && (
            <h2
              style={{
                borderRadius: '100px',
                fontSize: '4rem',
              }}
            >
              You are successfully assigned !!
            </h2>
          )}
          {IsUncorrect && (
            <h2
              style={{
                borderRadius: '100px',
                fontSize: '4rem',
              }}
            >
              ID was WRONG!!
            </h2>
          )}
          {IsAssigned && (
            <Link
              style={{
                borderRadius: '100px',
                fontSize: '4rem',
              }}
              to={'/game/player2'}
            >
              lets go!
            </Link>
          )}
          {IsAssigned && (
            <h2
              style={{
                borderRadius: '100px',
                fontSize: '4rem',
              }}
            >
              You will fight against {Game?.player1}！
            </h2>
          )}

          <Grid mr={10} spacing={10}>
            <p></p>
            <Grid mr={13} spacing={10}>
              <button
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '50px',
                  width: '50px',
                  fontSize: '20px',
                  color: 'green',
                }}
                onClick={handleClick}
              >
                Exit Room
              </button>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default JoinInvitedRoom;
