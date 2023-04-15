import React from 'react';
import { User } from '../../types/PrismaType';

interface UnblockButtonProps {
  user: User | undefined;
}

const UnblockButton = (props: UnblockButtonProps) => {
  console.log(props.user?.name);
  return (
    <>
      <h2>UnblockButton</h2>
    </>
  );
};

export default UnblockButton;
