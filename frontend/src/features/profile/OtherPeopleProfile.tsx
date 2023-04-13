import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import axios from 'axios';
import { User } from '../../types/PrismaType';
import ShowAvatar from '../../components/profile/ShowAvatar';
import FriendRequestButton from '../../components/profile/FriendRequestButton';
import FriendListButton from '../../components/profile/FriendListButton';
import { fetchProfileUser } from '../../hooks/profile/useProfileUser';

interface OtherPeopleProfileProps {
  other: User | undefined;
}

const OtherPeopleProfile = (props: OtherPeopleProfileProps) => {
  /** ************************* */
  // [get my information]
  const [user, setUser] = useState<User>();
  const UserPromises = fetchProfileUser();
  useEffect(() => {
    UserPromises.then((userDto: User) => {
      setUser(userDto);
      console.log('myinfo', user?.name);
    });
  }, []);

  /** ************************* */
  // [check the relationship between me and other people]
  // friend state 3 pattern
  const [isFriend, setIsFriend] = useState(false);
  // const [isBlockingUser, setIsBlockingUser] = useState(false);
  // friendでもblockしているuserでもなければ、どちらでも無いという判断ができる

  /** ************************* */
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

      // props.otherがfriendに含まれているかどうかを判断する
      if (props.other) {
        const friendFound: boolean = data.some(
          (friend) => friend.id === user?.id,
        );
        setIsFriend(friendFound);
      }
    });
  }, [user]);

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
        {!isFriend && (
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
        )}
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
      <h5>{isFriend ? '友達です' : '友達ではありません'}</h5>
    </div>
  );
};

export default OtherPeopleProfile;
