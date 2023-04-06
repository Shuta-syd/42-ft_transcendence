import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { User } from '../../types/PrismaType';
import Profile from './Profile';
import {fetchProfileUser} from "../../hooks/profile/useProfileUser";

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

    useEffect(() => {
        const fetchNonLoginUser = async () => {
            const { data } = await axios.get<User>(`http://localhost:8080/user/friend/nameSearch`);
            setNonLoginUser(data);
        }
        fetchNonLoginUser().then(r =>
            console.log('nonLoginUser', nonLoginUser)
        );
    },  []);

    const renderProfileStatus = () => {
        /* login userがparamのnameと一致した時にはProfile Componentを表示する */
        if (loginUser?.name === name) {
            return <Profile />
        }

        /* login userがparamのnameと一致しなかった時にはFriend Profile Componentにuserのpropsを渡して表示する */
        return <h1>IT IS NOT MY PAGE</h1>;
    };

    return (
        <div>
            <p>{renderProfileStatus()}</p>
        </div>
    );
};

export default ProfileRouting;
