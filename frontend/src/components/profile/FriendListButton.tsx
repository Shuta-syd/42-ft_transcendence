import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Avatar, Box, Grid } from '@mui/material';
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

  const ShowFriendList = () => (
    <Box
      sx={{
        position: 'absolute', // Add this line
        top: 50, // Adjust this value as needed
        width: '100%',
        height: '200px',
        overflowY: 'scroll',
        border: '5px solid #ccc',
      }}
    >
      <List>
        {friends.map((friend: User) => (
          <ListItem key={friend.id}>
            <Avatar src={friend.image} />
            <ListItemText primary={friend.name} secondary={friend.email} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Grid
      item
      xs={5}
      style={{
        position: 'relative', // Add this line
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
