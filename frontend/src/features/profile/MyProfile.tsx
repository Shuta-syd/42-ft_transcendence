import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Rating from '@mui/material/Rating';
import Grid from '@mui/material/Grid';
import { Match, User } from '../../types/PrismaType';
import { fetchProfileUser } from '../../hooks/profile/useProfileUser';
import useQueryMatches from '../../hooks/match/useWueryMatch';
import ShowAvatar from '../../components/profile/ShowAvatar';
import ImageUploadButton from '../../components/profile/ImageUploadButton';
import NotificationButton from '../../components/profile/NotificationButton';
import MatchListButton from '../../components/profile/MatchListButton';
import FriendListButton from '../../components/profile/FriendListButton';
import EditEmail from '../../components/profile/EditEmail';
import TwoFactorButton from '../../components/profile/TwoFactorButton';

const MyProfile = () => {
  const [user, setUser] = useState<User>();
  const UserPromises = fetchProfileUser();
  useEffect(() => {
    UserPromises.then((userDto: User) => {
      setUser(userDto);
    });
  }, []);

  const [matchArr, setMatches] = useState<Match[]>([]);
  // const [winnerId] = useState<string>('');
  const MatchPromises = useQueryMatches();
  useEffect(() => {
    MatchPromises.then((matches: Match[]) => {
      setMatches(matches);
      // setWinnerId(matches[matches.length - 1].winner_id);
    });
  }, []);

  interface MatchListProps {
    matches: Match[];
  }

  function ShowAchievement({ matches }: MatchListProps) {
    const countMyWinTime = () => {
      let count: number = 0;
      for (const match of matches) {
        const winnerName =
          match.winner_id === '1' ? match.player1 : match.player2;
        if (winnerName === user?.name) {
          count += 1;
        }
      }
      return count;
    };

    enum Achievement {
      'Beginner' = 0,
      'Intermediate' = 5,
      'Advanced' = 10,
      'Expert' = 15,
    }

    const getAchievement = () => {
      if (countMyWinTime() < Achievement.Intermediate) {
        return 'Beginner';
      }
      if (countMyWinTime() < Achievement.Advanced) {
        return 'Intermediate';
      }
      if (countMyWinTime() < Achievement.Expert) {
        return 'Advanced';
      }
      return 'Expert';
    };
    return (
      <div
        style={{
          color: '#3C444B',
        }}
      >
        <h2>
          Your current achievement : {getAchievement()}
          <p></p>
          <Rating
            name={user?.name}
            defaultValue={countMyWinTime()}
            precision={0.5}
            max={20}
            readOnly
          />
          <p></p>
        </h2>
      </div>
    );
  }

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files?.[0]) {
      URL.createObjectURL(files[0]);
      const file = files[0];
      let base64: string;
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        base64 = reader.result as string;

        try {
          await axios.post('http://localhost:8080/user/add/image',{ image: base64 });
          setProfileImage(base64);
        } catch (error) {
          console.error(error);
        }
      };
    }
  };

  const [profileImage, setProfileImage] = useState('');
  useEffect(() => {
    const profileUser = fetchProfileUser();
    profileUser.then((us) => {
      setProfileImage(us?.image);
    });
  }, []);

  /** ************************* */
  // [get my friends part]
  const [friends, setFriends] = useState<User[]>([]);
  const getFriends = async () => {
    const { data } = await axios.get<User[]>(
      `http://localhost:8080/user/friend`,
    );
    return data;
  };

  useEffect(() => {
    const friendsPromise = getFriends();
    friendsPromise.then((data) => {
      setFriends(data);
    });
  }, []);

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
          [My Profile]
        </Grid>
        <Grid
          item
          xs={5}
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
          }}
        >
          <NotificationButton />
        </Grid>
        <Grid item xs={5}>
          <ShowAvatar user={user} profileImage={profileImage} />
        </Grid>
        <Grid
          item
          xs={5}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#3C444B',
          }}
        >
          <ImageUploadButton onUpload={uploadImage} />
        </Grid>
        <Grid
          item
          xs={5}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#3C444B',
            marginTop: '-100px',
          }}
        >
          <EditEmail />
          <TwoFactorButton/>
        </Grid>
        <Grid
          item
          xs={5}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#B5D3D5',
            marginTop: '-20px',
          }}
        >
          <ShowAchievement matches={matchArr} />
        </Grid>
        <Grid container direction={'row'}>
          <MatchListButton />
          <FriendListButton friends={friends} />
        </Grid>
      </Grid>
    </div>
  );
};

export default MyProfile;
