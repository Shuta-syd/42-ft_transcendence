import React from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { User } from '../../types/PrismaType';

interface UnblockButtonProps {
  user: User | undefined;
}

const UnblockButton = (props: UnblockButtonProps) => {
  const handleClick = () => {
    console.log('Friend unblock Button');

    axios
      .delete(`http://localhost:8080/user/block/${props.user?.id}`)
      .then(() => console.log('unblock success!'))
      .catch((err) => {
        console.log('unblock error!', err);
      })
      .catch((error) => {
        console.error(error);
        alert(
          `アンブロック中にエラーが発生しました: ${(error as Error).message}`,
        );
      });
  };

  console.log(props.user?.name);
  return (
    <>
      <Button
        variant="outlined"
        size={'large'}
        color={'secondary'}
        onClick={handleClick}
      >
        {'Unblock'}
      </Button>
    </>
  );
};

export default UnblockButton;
