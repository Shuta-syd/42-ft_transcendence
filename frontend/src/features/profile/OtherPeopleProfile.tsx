import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import axios from 'axios';
import { User } from '../../types/PrismaType';
import ShowAvatar from '../../components/profile/ShowAvatar';
import FriendRequestButton from '../../components/profile/FriendRequestButton';
import FriendListButton from '../../components/profile/FriendListButton';

interface OtherPeopleProfileProps {
  other: User | undefined;
}

const OtherPeopleProfile = (props: OtherPeopleProfileProps) => {
  /** ************************* */
  // [get my friends part]
  const [friends, setFriends] = useState<User[]>([]);
  const getFriends = async () => {
    const { data } = await axios.get<User[]>(
      `http://localhost:8080/user/other/friend`,
      {
        params: {
          id: props.other?.id,
        },
      },
    );
    return data;
  };

  useEffect(() => {
    const friendsPromise = getFriends();
    friendsPromise.then((data) => {
      console.log('data => ', data[0]);
      setFriends(data);
    });
  }, []);

  /** ************************* */

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
        <Grid
          item
          xs={5}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FriendListButton friends={friends} />
        </Grid>
      </Grid>
    </div>
  );
};

export default OtherPeopleProfile;
