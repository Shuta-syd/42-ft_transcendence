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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Avatar
                variant="circular"
                color="success"
                alt={user?.name}
                src={profileImage}
                sx={{ width: 200, height: 200, marginRight: 2 }}
            />
            <div>
                <h1
                    style={{
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: 0,
                    }}
                >
                    {user?.name}
                </h1>
                <p
                    style={{
                        fontSize: '1.5rem',
                        color: 'white',
                        marginTop: '0.5rem',
                    }}
                >
                    {user?.email}
                </p>
            </div>
        </div>
    );
};


export default ShowAvatar;
