import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { User } from '../../types/PrismaType';
import Profile from './Profile';

const ProfileRouting = () => {
    const { id } = useParams();
    const [person, setPerson] = useState<User>();

    useEffect(() => {
        axios.get<User>(`http://localhost:8080/user`).then((res) => {
            setPerson(res.data);
        });
    }, [id]);

    const renderProfileStatus = () => {
        if (!person)
            return null;
        if (person?.name === id) {
            return <Profile />
        }
        return <div>ME</div>;
    };

    return (
        <div>
            <p>{renderProfileStatus()}</p>
        </div>
    );
};

export default ProfileRouting;
