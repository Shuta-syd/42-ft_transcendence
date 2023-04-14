import React from 'react';
import { User } from '../../types/PrismaType';

interface BlockButtonProps {
  user: User | undefined;
}

const BlockButton = (props: BlockButtonProps) => {
  console.log('BlockButton', props);
  return <div>BlockButton</div>;
};

export default BlockButton;
