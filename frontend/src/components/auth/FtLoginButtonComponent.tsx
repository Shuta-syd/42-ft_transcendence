import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { RootWebsocketContext } from '../../contexts/WebsocketContext';

const ftLoginURL = "http://localhost:8080/auth/login/42"

const CustomButton = styled(LoadingButton)({
  fontSize: 16,
  fontFamily: ['Lato', 'sans-serif'],
  backgroundColor: '#01babc',
  color: '#EDF0F4',
  '&:hover': {
    backgroundColor: '#01babc'
  },
});


function FtLoginButtonComponent() {
  const [Loading, setLoading] = useState(false);
  const rootSocket: Socket = useContext(RootWebsocketContext);

  const handleOnClick = () => { setLoading(true) }

  useEffect(() => {

    if (Loading) {
      rootSocket.connect();
    } else {
      rootSocket.disconnect();
    }
  }, [Loading])

  return (
    <CustomButton
      loading={Loading}
      variant='contained'
      sx={{ backgroundColor: '#01babc' }}
      onClick={handleOnClick}
      href={ftLoginURL}
    >
      Continue with 42 Login
    </CustomButton>
  );
}

export default FtLoginButtonComponent;
