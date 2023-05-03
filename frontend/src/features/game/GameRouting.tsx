import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import useSocket from '../../hooks/useSocket';
import GamePlayer1 from './GamePlayer1';
import GamePlayer2 from './GamePlayer2';
import GameObserver from './GameObserver';
import GameSelectRoom from './GameSelectRoom';
import CreateGameRoom from './CreateGameRoom';
import InviteRoom from './InviteRoom';
import JoinInvitedRoom from './JoinInvitedRoom';
import { User } from '../../types/PrismaType';

const GameRouting = () => {
  const { room } = useParams<{ room: string }>();
  const [user, setUser] = useState<User>();
  const [Loading, setLoading] = useState<boolean>(true);
  const socket: Socket = useSocket('http://localhost:8080/game-rewrite');

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: userData } = await axios.get<User>(`http://localhost:8080/user`);
        setUser(userData);
      } catch (error) {
        alert('エラーが発生しました。リロードしてください');
      } finally {
        setLoading(false);
      }
    }
    getUser();
  }, []);


  if (Loading || user === undefined) return <></>;

  switch (room) {
    case 'player1':
      return <GamePlayer1 socket={socket} user={user} />;
    case 'player2':
      return <GamePlayer2 socket={socket} user={user} />;
    case 'observer':
      return <GameObserver socket={socket} />;
    case 'select_room':
      return <GameSelectRoom user={user} />;
    case 'game_room':
      return <CreateGameRoom user={user} />;
    case 'invite_room':
      return <InviteRoom socket={socket} user={user}/>;
    case 'join_invited_room':
      return <JoinInvitedRoom socket={socket} user={user} />;
    default:
      return (
        <div>
          <h1>THIS PAGE IS NOT FOUND</h1>
        </div>
      );
  }
};

export default GameRouting;
