import React from 'react';
import { styled } from '@mui/material/styles';
import { Avatar } from '@mui/material';
import Badge from '@mui/material/Badge';
import { User } from '../../types/PrismaType';

interface ShowAvatarProps {
  user?: User;
  profileImage: string | undefined;
}

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    width: '15%',
    height: '15%',
    borderRadius: '50%',
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
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


const ShowAvatar = ({ user, profileImage }: ShowAvatarProps) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <StyledBadge
      sx={{
        width: 300, // Update width here
        height: 300, // Update height here
        marginRight: 2,
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
          width: 300, // Update width here
          height: 300, // Update height here
          marginRight: 2,
        }}
      />
    </StyledBadge>
    <div>
      <h1
        style={{
          fontSize: '4rem',
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
          fontSize: '2rem',
          color: '#3C444B',
          marginTop: '1rem',
          marginLeft: 80,
        }}
      >
        {user?.email}
      </h2>
    </div>
  </div>
);

export default ShowAvatar;
