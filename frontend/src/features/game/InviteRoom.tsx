import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid } from '@mui/material';
import { Socket } from 'socket.io-client';
import { InviteGame, User } from '../../types/PrismaType';
import { GameInviteRoomReq, useGameUser } from '../../hooks/game/useGameuser';

const InviteRoom = (props: { socket: Socket }) => {
  const { socket } = props;
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

  // const [text, setText] = useState("");

  function handleCopy() {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
    }
  }

  useEffect(() => {
    // setText(`You have been invited by ${user?.name} to ${roomId}! Let's join now!\n`);
  }, [user, roomId]);

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
      <h1>[Host Room!!]</h1>
      <Grid
        container
        justifyContent="center"
        marginTop="-5%"
        alignItems="center"
        style={{ minHeight: '100vh' }}
        fontSize="h4.fontSize"
        direction="column"
      >
        <h2>You are {user?.name}!!!</h2>
        <h2>Invite Id is {roomId}!!!</h2>
        <p></p>
        <button
          style={{
            borderRadius: '100px',
            fontSize: '4rem',
          }}
          onClick={handleCopy}
        >
          Copy ID👍
        </button>
        <p></p>
        <div>
          <h1>
            Your Room 👉
            <Link style={{}} to={'/game/player1'}>
              lets go!!
            </Link>
            <p></p>
          </h1>
        </div>
        <button
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80px',
            width: '100px',
            fontSize: '20px',
            color: 'green',
          }}
          onClick={handleClick}
        >
          Exit Room
        </button>
      </Grid>
    </div>
  );
};

export default InviteRoom;
