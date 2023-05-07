import React, { ChangeEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid } from '@mui/material';
import { Game, User } from '../../types/PrismaType';
import { fetchGameRoomArr } from '../../hooks/game/useGameObserver';
import { GameObserverReq } from '../../hooks/game/useGameuser';

const GameSelectRoom = (props: { user: User }) => {
  const { user } = props;
  const [tmpNumber, setTmpNumber] = useState<string>('');
  const [number, setNumber] = useState<number>(0);
  const [IsAssigned, setIsAsssigned] = useState<boolean>(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTmpNumber(event.target.value);
  };

  const handleButtonClick = () => {
    setNumber(Number(tmpNumber));
    if (user?.name) {
      const observseDto = {
        name: user.name,
        roomId: number,
      };
      // at the beginning, roomId is 0, so escaped
      if (observseDto.roomId === 0) return;
      const gameRes = GameObserverReq(observseDto);
      gameRes.then((game: Game) => {
        setIsAsssigned(true);
      });
    }
  };

  const [GameRoomArr, setGameRoomArr] = useState<Game[]>([]);
  const GameRoomPromises = fetchGameRoomArr();
  useEffect(() => {
    GameRoomPromises.then((games: Game[]) => {
      setGameRoomArr(games);
    });
  }, [GameRoomPromises]);

  function getPlayer2DisplayText(player2: string) {
    if (!player2) {
      return "Loading";
    }

    if (player2.startsWith("player2_")) {
      return "waiting for player2";
    }

    return player2;
  }


  return (
    <div
      style={{
        backgroundColor: '#EDF0F4',
        minHeight: '100vh',
        backgroundSize: 'cover',
      }}
    >
      <h2>
        <h4>[Room List]</h4>
      </h2>
      <Grid
        container
        justifyContent="center"
        marginTop="-5%"
        alignItems="center"
        style={{ minHeight: '100vh' }}
        fontSize="h5.fontSize"
      >
        <h1>
          {GameRoomArr.map((game) => (
              <div key={game.id}>
                <h4>
                  [{game.id}] {game.player1} vs {getPlayer2DisplayText(game.player2)}
                </h4>
              </div>
          ))}
          <div>
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
            <p
              style={{
                fontSize: '2rem',
              }}
            >
              ※ Please enter the button at least 2 times!
            </p>
            {IsAssigned && <p>You are successfully assigned !!</p>}
            {IsAssigned && (
              <Link to={'/game/observer'}>lets go! room{number}!!</Link>
            )}
          </div>
        </h1>
      </Grid>
    </div>
  );
};

export default GameSelectRoom;
