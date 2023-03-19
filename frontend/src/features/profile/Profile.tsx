import React, {useEffect, useState } from 'react';
import {Avatar} from "@mui/material";
import Rating from '@mui/material/Rating';
import {deepPurple} from "@mui/material/colors";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
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
            <Rating
                name={user?.name}
                defaultValue={4}
                precision={0.5}
            />
            <p></p>
            <TextField
                id="input-with-icon-textfield"
                label="Find new friends!"
                size="small"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <AccountCircle />
                        </InputAdornment>
                    ),
                }}
                variant="standard"
            />
        </div>
    );
}


export default Profile;
