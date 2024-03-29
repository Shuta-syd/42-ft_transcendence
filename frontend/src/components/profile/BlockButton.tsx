import React from 'react';
import { Button } from '@mui/material';
import axios from 'axios';
import { User } from '../../types/PrismaType';

interface BlockButtonProps {
  user: User | undefined;
}

const BlockButton = (props: BlockButtonProps) => {
  const handleClick = () => {
    console.log('BlockButton', props.user?.name);
    axios
      .post(`http://localhost:8080/user/block/${props.user?.id}`)
      .then((res) => {
        console.log('block success!', res);
      })
      .catch((err) => {
        console.log('block error!', err);
      })
      .catch((error) => {
        console.error(error);
        alert(`ブロック中にエラーが発生しました: ${(error as Error).message}`);
      });
  };
  return (
    <>
      <Button
        variant="outlined"
        size={'large'}
        color={'error'}
        onClick={handleClick}
      >
        {'Block'}
      </Button>
    </>
  );
};

export default BlockButton;
