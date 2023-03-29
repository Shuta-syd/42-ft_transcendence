import { Button, styled } from '@mui/material';
import React from 'react';

const ftLoginURL = "http://localhost:8080/auth/login/42"

const CustomButton = styled(Button)({
  fontSize: 16,
  fontFamily: ['Lato', 'sans-serif'],
  backgroundColor: '#01babc',
  color: '#EDF0F4',
  '&:hover': {
    backgroundColor: '#01babc'
  },
});

function FtLoginButtonComponent() {
  return (
    <CustomButton
      variant='contained'
      href={ftLoginURL}
      sx={{ backgroundColor: '#01babc' }}
    >
      Continue with 42 Login
    </CustomButton>
  );
}

export default FtLoginButtonComponent;
