import React from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import { User } from '../../types/PrismaType';

interface UnfriendButtonProps {
  user: User | undefined;
}

const UnfriendButton = (props: UnfriendButtonProps) => {
  const handleClick = () => {
    console.log('Friend Request Button');

    /* login user -> other peopleに対してunfriend requestを送信する */
    axios
      .delete(`http://localhost:8080/user/friend`, {
        data: {
          friendId: props.user?.id,
        },
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
  console.log('UnfriendButton', props.user?.name);
  return (
    <>
      <Button
        variant="outlined"
        size={'large'}
        color={'secondary'}
        onClick={handleClick}
      >
        {'Unfriend'}
      </Button>
    </>
  );
};

export default UnfriendButton;
