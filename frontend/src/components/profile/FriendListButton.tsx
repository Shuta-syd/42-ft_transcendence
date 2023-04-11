import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const FriendListButton = () => (
  <div>
    <Stack spacing={2} direction="row">
      <Button variant="outlined" color="primary">
        Friend List
      </Button>
    </Stack>
  </div>
);

export default FriendListButton;
