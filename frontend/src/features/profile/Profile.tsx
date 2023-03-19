import React, {ChangeEvent, useEffect, useState} from 'react';
import {Avatar, Button} from "@mui/material";
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

    const [inputId, setInputId] = useState<string>("");
    const HandleInputID = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputId(e.target.value);
    }

    const handleButtonClick = () => {
        console.log(inputId);
    }

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
            <h2>Find new friends!</h2>
            <TextField
                id="input-with-icon-textfield"
                label="Please enter [friend ID]"
                size="medium"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <AccountCircle />
                        </InputAdornment>
                    ),
                    onChange: HandleInputID
                }}
                variant="standard"
            />
            <Button onClick={handleButtonClick}>
                ENTER
            </Button>
        </div>
    );
}


export default Profile;
