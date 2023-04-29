import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { User } from '../../types/PrismaType';
import MyProfile from './MyProfile';
import OtherPeopleProfile from './OtherPeopleProfile';
import { fetchProfileUser } from '../../hooks/profile/useProfileUser';

const ProfileRouting = () => {
  const { name } = useParams();
  const [loginUser, setLoginUser] = useState<User>();
  const [nonLoginUser, setNonLoginUser] = useState<User>();

  /* 自分が誰なのかという情報 */
  useEffect(() => {
    const UserPromises = fetchProfileUser();
    UserPromises.then((userDto: User) => {
      setLoginUser(userDto);
    });
  }, []);

  /* nonLogin userの情報 */
  useEffect(() => {
    const fetchNonLoginUser = async (nm: string | undefined) => {
      try {
        const { data } = await axios.get<User>(
          `http://localhost:8080/user/name`,
          {
            params: {
              name: nm,
            },
          },
        );
        setNonLoginUser(data);
      } catch (error) {
        console.error(error);
        alert(
          `ユーザー情報の取得中にエラーが発生しました: ${
            (error as Error).message
          }`,
        );
      }
    };
    if (name) {
      fetchNonLoginUser(name);
    }
  }, []);

  const renderProfileStatus = () => {
    /* login userがparamのnameと一致した時にはProfile Componentを表示する */
    if (loginUser?.name === name) {
      return <MyProfile />;
    }
    if (loginUser?.name !== name && nonLoginUser?.name === name) {
      /* login userがparamのnameと一致しなかった時にはFriend Profile Componentにuserのpropsを渡して表示する */
      return <OtherPeopleProfile other={nonLoginUser} />;
    }
    return <h1>THE NAME PERSON IS NOT EXIST</h1>;
  };

  return (
    <div>
      <>{renderProfileStatus()}</>
    </div>
  );
};

export default ProfileRouting;
