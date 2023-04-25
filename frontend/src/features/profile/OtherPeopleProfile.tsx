import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import axios from 'axios';
import { User } from '../../types/PrismaType';
import ShowAvatar from '../../components/profile/ShowAvatar';
import FriendRequestButton from '../../components/profile/FriendRequestButton';
import { fetchProfileUser } from '../../hooks/profile/useProfileUser';
import UnfriendButton from '../../components/profile/UnfriendButton';
import BlockButton from '../../components/profile/BlockButton';
import UnblockButton from '../../components/profile/UnblockButton';

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
    });
  }, []);

  /** ************************* */
  // [check the relationship between me and other people]
  // friend state 3 pattern
  const [isFriend, setIsFriend] = useState(false);
  const [isBlockingUser, setIsBlockingUser] = useState(false);
  // friendでもblockしているuserでもなければ、どちらでも無いという判断ができる

  /** ************************* */
  /** ************************* */
  // [get my friends part]
  // eslint-disable-next-line no-unused-vars
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
      setFriends(data);

      // props.otherがfriendに含まれているかどうかを判断する
      if (props.other) {
        const friendFound: boolean = data.some(
          (friend) => friend.id === user?.id,
        );
        setIsFriend(friendFound);
      }
    });


    /** ************************* */
    // [check the relationship between me and other people]
    axios
      .get<boolean>(`http://localhost:8080/user/block/${props.other?.id}`)
      .then((res) => {
        setIsBlockingUser(res.data);
      })
      .catch((err) => {
      });
  }, [user]);

  /** ************************* */

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
        {!isFriend && !isBlockingUser && (
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
        {isFriend && !isBlockingUser && (
          <Grid
            item
            xs={5}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <UnfriendButton user={props.other} />
          </Grid>
        )}
        {!isBlockingUser && !isFriend && (
          <Grid
            item
            xs={5}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BlockButton user={props.other} />
          </Grid>
        )}
        {isBlockingUser && (
          <Grid
            item
            xs={5}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <UnblockButton user={props.other} />
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
        </Grid>
      </Grid>
    </div>
  );
};

export default OtherPeopleProfile;
