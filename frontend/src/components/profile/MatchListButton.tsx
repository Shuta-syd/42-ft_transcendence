import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Box, Typography } from '@mui/material';
import { Match } from '../../types/PrismaType';

interface MatchListProps {
  matches: Match[];
}

const MatchListButton = (props: MatchListProps) => {
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handleMatchListButton = () => {
    setIsButtonClicked(!isButtonClicked);
  };

  const ShowMatchList = () => {
    const renderMatches = () => {
      if (props.matches.length === 0) {
        return (
          <Typography variant="h5" fontWeight="bold" color="grey">
            No match list...
          </Typography>
        );
      }

      return (
        <List>
          {props.matches.map((match) => (
            <ListItem key={match.id}>
              <ListItemText primary={`${match.player1} vs ${match.player2}    winner: ${match.winner_id === '1' ? match.player1 : match.player2}`} />
            </ListItem>
          ))}
        </List>
      );
    };

    return (
      <Box
        sx={{
          position: 'absolute',
          top: 50,
          width: '50%',
          height: '200px',
          overflowY: 'scroll',
          border: '5px solid #ccc',
        }}
      >
        {renderMatches()}
      </Box>
    );
  };

  return (
    <Grid
      item
      xs={5}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '0px',
      }}
    >
      <Stack spacing={2} direction="column">
        <Button
          variant="outlined"
          color="primary"
          onClick={handleMatchListButton}
        >
          Match List
        </Button>
      </Stack>
      {isButtonClicked && <ShowMatchList />}
    </Grid>
  );
};

export default MatchListButton;
