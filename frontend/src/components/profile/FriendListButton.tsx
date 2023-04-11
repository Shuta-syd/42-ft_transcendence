import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Avatar, Box, Grid, Typography } from '@mui/material';
import { User } from '../../types/PrismaType';

const FriendListButton = () => {
  const [friends, setFriends] = useState<User[]>([]);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const getFriends = async () => {
    const { data } = await axios.get<User[]>(
      `http://localhost:8080/user/friend`,
    );
    return data;
  };

  const HandleFriendListButton = () => {
    const friendsPromise = getFriends();
    friendsPromise.then((data) => {
      console.log('data => ', data[0]);
      setFriends(data);
    });
    setIsButtonClicked(!isButtonClicked);
  };

  const ShowFriendList = () => {
    const renderFriends = () => {
      if (friends.length === 0) {
        return (
          <Typography variant="h5" fontWeight="bold" color="grey">
            You currently have no friends...
          </Typography>
        );
      }

      return friends.map((friend: User) => (
        <ListItem key={friend.id}>
          <Avatar src={friend.image} />
          <ListItemText primary={friend.name} secondary={friend.email} />
        </ListItem>
      ));
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
        <List>{renderFriends()}</List>
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
          onClick={HandleFriendListButton}
        >
          Friend List
        </Button>
      </Stack>
      {isButtonClicked && <ShowFriendList />}
    </Grid>
  );
};

export default FriendListButton;
