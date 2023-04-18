import React, { useState } from 'react';
import { Button } from '@mui/material';
import axios from 'axios';
import { User } from '../../types/PrismaType';

interface FriendRequestButtonProps {
  user: User | undefined;
}

const FriendRequestButton = (props: FriendRequestButtonProps) => {
  const [isFriendRequest, setIsFriendRequest] = useState(false);

  const handleClick = () => {
    console.log('Friend Request Button');
    setIsFriendRequest(!isFriendRequest);

    /* login user -> other peopleに対してfriend requestを送信する */
    axios
      .post(`http://localhost:8080/user/friendReq`, {
        friendId: props.user?.id,
      })
      .then(
        (res) => {
          console.log('success!', res);
        },
        (err) => {
          console.log('error!', err);
        },
      );
  };

  return (
    <>
      <Button variant="contained" size={'large'} onClick={handleClick}>
        {'Friend Request'}
      </Button>
    </>
  );
};

export default FriendRequestButton;
