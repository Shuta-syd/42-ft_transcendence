import React, {useEffect, useState } from 'react';
import {Avatar} from "@mui/material";
import {deepPurple} from "@mui/material/colors";
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
            <Avatar
                sx={{ bgcolor: deepPurple[500]
                    , width: 100
                    , height: 100}}
            >
                <h1>
                {user?.name}
                </h1>
            </Avatar>
        </div>
    );
}


export default Profile;
