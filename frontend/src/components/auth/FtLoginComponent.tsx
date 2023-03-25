import { Button } from '@mui/material';
import React from 'react';

const ftLoginURL = "http://localhost:8080/auth/login/42"

function FtLoginComponent() {
  return (
    <Button
      variant='contained'
      href={ftLoginURL}
      >42 login</Button>
  );
}

export default FtLoginComponent;
