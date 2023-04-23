/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Avatar } from '@mui/material';
import Badge from '@mui/material/Badge';
import { User } from '../../types/PrismaType';

interface ShowAvatarProps {
  user?: User;
  profileImage: string | undefined;
}

const CustomBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: 'gray',
    color: 'gray',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    width: '15%',
    height: '15%',
    borderRadius: '50%',
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

function ShowAvatar({ user, profileImage }: ShowAvatarProps) {
  const [userStatus, setUserStatus] = useState('ONLINE');

  useEffect(() => {

  }, []);


  return (
    <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <CustomBadge
      sx={{
        width: 200, // Update width here
        height: 200, // Update height here
        marginRight: 2,
        "& .MuiBadge-badge": {
          backgroundColor: 'blue', // バッジのドットの色を青色に変更する例
        }
      }}
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant={'dot'}
    >
      <Avatar
        variant="circular"
        color="success"
        alt={user?.name}
        src={profileImage}
        sx={{
          width: 200, // Update width here
          height: 200, // Update height here
          marginRight: 2,
        }}
      />
    </CustomBadge>
    <div>
      <h1
        style={{
          fontSize: '3.4rem',
          fontWeight: 'bold',
          color: '#3C444B',
          marginBottom: 0,
          marginLeft: 50,
        }}
      >
        {user?.name}
      </h1>
      <h2
        style={{
          fontSize: '1rem',
          color: 'grey',
          marginTop: '1rem',
          marginLeft: 80,
        }}
      >
        {user?.email}
      </h2>
    </div>
  </div>
  )
}

export default ShowAvatar;
