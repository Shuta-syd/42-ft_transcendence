import React, {useEffect, useState } from 'react';
import {Avatar} from "@mui/material";
import { User } from "../../types/PrismaType";
import { useProfileUser } from "../../hooks/profile/useProfileUser";

const Profile = () => {
    const [user, setUser] = useState<User>();

    const UserPromises = useProfileUser();
    useEffect(() => {
        UserPromises.then((userDto: User) => {
            setUser(userDto);
        });
    }, [UserPromises]);

    return (
        <div>
            <Avatar>{user?.name}</Avatar>
        </div>
    );
}


export default Profile;
