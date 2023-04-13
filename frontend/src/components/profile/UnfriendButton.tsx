import React from 'react';
import { User } from '../../types/PrismaType';

interface UnfriendButtonProps {
  user: User | undefined;
}

const UnfriendButton = (props: UnfriendButtonProps) => {
  console.log('UnfriendButton', props.user?.name);
  return <div>UnfriendButton</div>;
};

export default UnfriendButton;
