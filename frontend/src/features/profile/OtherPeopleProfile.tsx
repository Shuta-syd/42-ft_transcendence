import React from 'react';
import { Grid } from '@mui/material';
import { User } from '../../types/PrismaType';
import ShowAvatar from '../../components/profile/ShowAvatar';
import FriendRequestButton from '../../components/profile/FriendRequestButton';

interface OtherPeopleProfileProps {
  friend: User | undefined;
}

const OtherPeopleProfile = (props: OtherPeopleProfileProps) => (
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
        [{props.friend?.name} Profile]
      </Grid>
      <Grid item xs={5}>
        <ShowAvatar user={props.friend} profileImage={props.friend?.image} />
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
        <FriendRequestButton user={props.friend} />
      </Grid>
      {/* <Grid */}
      {/*  item */}
      {/*  xs={5} */}
      {/*  sx={{* /}
      {/*    display: 'flex', */}
      {/*    alignItems: 'center', */}
      {/*    justifyContent: 'center', */}
      {/*  }} */}
      {/* > */}
      {/*  <FriendListButton /> */}
      {/* </Grid> */}
    </Grid>
  </div>
);

export default OtherPeopleProfile;
