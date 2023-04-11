import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Avatar } from '@mui/material';
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
    <p>
      <List>
        {friends.map((friend: User) => (
          <ListItem key={friend.id}>
            <Avatar src={friend.image} />
            <ListItemText primary={friend.name} secondary={friend.email} />
          </ListItem>
        ))}
      </List>
    </p>
  );

  return (
    <>
      <Stack spacing={2} direction="row">
        <Button
          variant="outlined"
          color="primary"
          onClick={HandleFriendListButton}
        >
          Friend List
        </Button>
      </Stack>
      {isButtonClicked && <ShowFriendList />}
    </>
  );
};

export default FriendListButton;
