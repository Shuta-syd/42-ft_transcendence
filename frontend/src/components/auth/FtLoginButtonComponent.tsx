import { Button } from '@mui/material';
import React from 'react';

const ftLoginURL = "http://localhost:8080/auth/login/42"

function FtLoginButtonComponent() {
  return (
    <Button
      variant='contained'
      href={ftLoginURL}
      sx={{ backgroundColor: '#01babc' }}
    >
      42 login
    </Button>
  );
}

export default FtLoginButtonComponent;
