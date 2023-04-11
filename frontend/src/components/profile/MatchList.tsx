import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const MatchListButton = () => {
  const [matchListVisible, setMatchListVisible] = useState(false);

  const handleMatchListButton = () => {
    setMatchListVisible(!matchListVisible);
  };

  const dummyMatches = [
    { id: 1, name: 'Match 1' },
    { id: 2, name: 'Match 2' },
    { id: 3, name: 'Match 3' },
  ];

  const MatchList = () => (
    <List>
      {dummyMatches.map((match) => (
        <ListItem key={match.id}>
          <ListItemText primary={match.name} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Grid
      item
      xs={5}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '0px',
      }}
    >
      <Stack spacing={2} direction="row">
        <Button
          variant="outlined"
          color="primary"
          onClick={handleMatchListButton}
        >
          Match List
        </Button>
      </Stack>
      {matchListVisible && <MatchList />}
    </Grid>
  );
};

export default MatchListButton;
