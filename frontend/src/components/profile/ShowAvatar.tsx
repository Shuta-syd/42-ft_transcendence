import React from 'react';
import { Avatar } from "@mui/material";
import { User } from "../../types/PrismaType";

interface ShowAvatarProps {
    user?: User;
    profileImage: string;
}

const ShowAvatar = ({ user, profileImage }: ShowAvatarProps) => {
    console.log('ShowAvatar', user, profileImage);
    return (
        <div>
            <Avatar
                variant="circular"
                color="success"
                alt={user?.name}
                src={profileImage}
                sx={{width: 200, height: 200, margin: 2}}
            >
            </Avatar>
            <h1>
                {user?.name}
            </h1>
        </div>
    );
};

export default ShowAvatar;
