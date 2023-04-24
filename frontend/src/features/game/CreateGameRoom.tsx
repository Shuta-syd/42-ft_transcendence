import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { Game, User } from '../../types/PrismaType';
import { GameRoomReq, useGameUser } from '../../hooks/game/useGameuser';

const CreateGameRoom = () => {
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

  function showPlayer2() {
    const compare: string = 'player2_';
    if (game?.player2.substring(0, 8) === compare.substring(0, 8)) {
      return <Typography variant="h4">Player2: Loading</Typography>;
    }
    return <Typography variant="h4">Player2: {game?.player2}</Typography>;
  }

  const ShowPositions = () => {
    if (user?.name) {
      return (
        <Box>
          <Typography variant="h4">You are in room {roomId}</Typography>
          <Typography variant="h4">Player1: {game?.player1}</Typography>
          {showPlayer2()}
        </Box>
      );
    }
    return (
      <Typography variant="h5">
        Your session is expired. Please login again...
      </Typography>
    );
  };

  const ShowPage = () => {
    if (game?.player1 !== user?.name) {
      return <Link to={'/game/player2'}>Player2</Link>;
    }
    return <Link to={'/game/player1'}>Player1</Link>;
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
      <Box>
        <ShowPositions />
        <Typography variant="h4">Your Room 👉 {ShowPage()} !!!</Typography>
      </Box>
    </Box>
  );
};

export default CreateGameRoom;
