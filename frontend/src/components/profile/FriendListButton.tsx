import React, { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Avatar, Box, Grid, Typography } from '@mui/material';
import { User } from '../../types/PrismaType';
import { RootWebsocketContext } from '../../contexts/WebsocketContext';

type FriendListButtonProps = {
  friends: User[];
};

const FriendListButton = ({ friends }: FriendListButtonProps) => {
  const [friendsStatus, setFriendsStatus] = useState(new Map<string, number>());
  const rootSocket = useContext(RootWebsocketContext);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const HandleFriendListButton = () => {
    setIsButtonClicked(!isButtonClicked);
  };

  useEffect(() => {
    rootSocket.on('friend_online_status', ({ status }) => {
      setFriendsStatus(status);
    });

    rootSocket.emit('friend_online_status_check');
  }, [rootSocket]);

  const getStatus = (status: number | undefined) => {
    switch(status) {
      case 1:
        return 'Online';
      case 2:
        return 'InGame';
      default:
        return 'OFFLINE';
    }
  };

  const ShowFriendList = () => {
    const renderFriends = () => {
      if (friends.length === 0) {
        return (
          <Typography variant="h5" fontWeight="bold" color="grey">
            No friends...
          </Typography>
        );
      }

      const handleClick = (friendName: string) => () => {
        window.location.href = `/user/${friendName}`;
      };

      return friends.map((friend: User) => (
        <ListItem
          key={friend.id}
          onClick={handleClick(friend.name)}
          style={{ cursor: 'pointer' }}
        >
          <Avatar src={friend.image} />
          <ListItemText primary={friend.name} sx={{ marginLeft: '10px' }} />
          <ListItemText primary={getStatus(friendsStatus?.get(friend.id))} sx={{ marginLeft: '10px' }} />
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
