import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { Game, User } from '../../types/PrismaType';

const CreateGameRoom = ({ user }: { user: User }) => {
  const [game, setGame] = useState<Game>();
  const [roomId, setRoomId] = useState<number>();
  const [Loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const createRoom = async () => {
      try {
        const { data:GameRoom } = await axios.post<Game>(`http://localhost:8080/game-rewrite/random-game/player`)
        setGame(GameRoom);
        setRoomId(GameRoom?.id);
      } catch (error) {
        alert('エラーが発生しました。リロードしてください');
      } finally {
        setLoading(false);
      }
    }

    createRoom();
  }, []);

  if (Loading) return <></>;

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
