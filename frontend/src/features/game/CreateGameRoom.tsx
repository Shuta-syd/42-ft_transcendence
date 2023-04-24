import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { Box, Button, Typography } from '@mui/material';
import { Game, User } from '../../types/PrismaType';
import { GameRoomReq, useGameUser } from '../../hooks/game/useGameuser';

const CreateGameRoom = (props: { socket: Socket }) => {
  const { socket } = props;
  const [user, setUser] = useState<User>();
  const [game, setGame] = useState<Game>();
  const [roomId, setRoomId] = useState<number | undefined>(undefined);

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
      setRoomId(Gamedto?.id);
    });
  }, [user]);

  const handleClick = () => {
    socket.emit('TerminateGame', user?.name);
  };

  const ShowPage = () => {
    if (game?.player1 !== user?.name) {
      return <Link to={'/game/player2'}>Player2</Link>;
    }
    return <Link to={'/game/player1'}>Player1</Link>;
  };

  function showPlayer2() {
    const compare: string = 'player2_';
    if (game?.player2.substring(0, 8) === compare.substring(0, 8)) {
      return <h2>Player2: Loading</h2>;
    }
    return <h2>Player2: {game?.player2}!!!</h2>;
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
    return <div>Your session is expired. Please login again...</div>;
  };

  return (
    <Box
      sx={{
        backgroundColor: '#EDF0F4',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="h3" gutterBottom>
        CreateGameRoom.tsx
      </Typography>
      <Box>
        <ShowPositions />
        <Typography variant="h4">Your Room 👉 {ShowPage()} !!!</Typography>
      </Box>
      <Box mt={2}>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleClick}
        >
          Exit Room
        </Button>
      </Box>
    </Box>
  );
};

export default CreateGameRoom;
