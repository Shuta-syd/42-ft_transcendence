import React from 'react';
import { Grid } from '@mui/material';
import { User } from '../../types/PrismaType';
import ShowAvatar from '../../components/profile/ShowAvatar';
import FriendRequestButton from '../../components/profile/FriendRequestButton';

interface OtherPeopleProfileProps {
  other: User | undefined;
}

const OtherPeopleProfile = (props: OtherPeopleProfileProps) => {
  console.log(props.other);
  return (
    <div
      style={{
        backgroundColor: '#EDF0F4',
        minHeight: '100vh',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Grid container direction="column" spacing={3}>
        <Grid
          item
          xs={5}
          sx={{
            fontSize: '2rem',
            fontWeight: 'bold',
          }}
        >
          [{props.other?.name} Profile]
        </Grid>
        <Grid item xs={5}>
          <ShowAvatar user={props.other} profileImage={props.other?.image} />
        </Grid>
        <Grid
          item
          xs={5}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FriendRequestButton user={props.other} />
        </Grid>
      </Grid>
    </div>
  );
};

export default OtherPeopleProfile;
