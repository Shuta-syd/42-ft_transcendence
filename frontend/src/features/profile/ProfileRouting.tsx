import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { User } from '../../types/PrismaType';
import Profile from './Profile';
import {fetchProfileUser} from "../../hooks/profile/useProfileUser";

const ProfileRouting = () => {
    const { id } = useParams();
    const [person, setPerson] = useState<User>();
    const [loginUser, setLoginUser] = useState<User>();

    const UserPromises = fetchProfileUser();
    useEffect(() => {
        UserPromises.then((userDto: User) => {
            setLoginUser(userDto);
        });
    }, []);

    useEffect(() => {
        axios.get<User>(`http://localhost:8080/user`).then((res) => {
            setPerson(res.data);
        });
    }, [id]);

    const renderProfileStatus = () => {
        if (!person)
            return null;
        if (loginUser?.name === id) {
            return <Profile />
        }
        return <h1>IT IS NOT MY PAGE</h1>;
    };

    return (
        <div>
            <p>{renderProfileStatus()}</p>
        </div>
    );
};

export default ProfileRouting;
