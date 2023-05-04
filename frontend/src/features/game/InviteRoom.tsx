import React, {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {Grid} from '@mui/material';
import {Socket} from 'socket.io-client';
import {InviteGame, User} from '../../types/PrismaType';
import {GameInviteRoomReq} from '../../hooks/game/useGameuser';

const InviteRoom = (props: { socket: Socket, user: User }) => {
  const {user} = props;
  const [roomId, setRoomId] = useState<string | undefined>(undefined);
  const [copySuccess, setCopySuccess] = useState(false); // Add this line

  const gamePromisesRef = useRef<Promise<InviteGame>>();

  useEffect(() => {
    gamePromisesRef.current = GameInviteRoomReq(user.name);
  }, []);

  useEffect(() => {
    gamePromisesRef.current?.then((dto: InviteGame) => {
      setRoomId(dto.id);
    });
  }, [user, gamePromisesRef]);

  function handleCopy() {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopySuccess(true); // Add this line
    }
  }

  return (
      <div
          style={{
            backgroundColor: '#EDF0F4',
            minHeight: '100vh',
            backgroundSize: 'cover',
          }}
      >
        <h1>[Host Room]</h1>
        <Grid
            container
            justifyContent="center"
            marginTop="-5%"
            alignItems="center"
            style={{minHeight: '100vh'}}
            fontSize="h4.fontSize"
            direction="column"
        >
          <p></p>
          <button
              style={{
                borderRadius: '100px',
                fontSize: '2rem',
              }}
              onClick={handleCopy}
          >
            Copy ID👍
          </button>
          {copySuccess && <p>Copy success</p>} {/* Add this line */}
          <p></p>
          <div>
            <h5>
              Your Room 👉
              <Link style={{}} to={'/game-rewrite/player1'}>
                lets go!!
              </Link>
              <p></p>
            </h5>
          </div>
        </Grid>
      </div>
  );
};

export default InviteRoom;
