import React from 'react';
import { Button } from '@mui/material';
import { User } from '../../types/PrismaType';

interface BlockButtonProps {
  user: User | undefined;
}

const handleClick = () => {
  console.log('Block Button');
  return <>ok</>;
};

const BlockButton = (props: BlockButtonProps) => {
  console.log('BlockButton', props);
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
