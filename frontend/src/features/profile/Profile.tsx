import React, {ChangeEvent, useEffect, useState} from 'react';
import {Avatar, Button} from "@mui/material";
import axios from "axios";
import Rating from '@mui/material/Rating';
import {deepPurple} from "@mui/material/colors";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { User } from "../../types/PrismaType";
import { useProfileUser } from "../../hooks/profile/useProfileUser";
import { sendFriendRequest } from "../../hooks/profile/sendFriendRequests";
// import { useQueryFriend } from "../../hooks/user/useQueryFriend";

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

    const handleDecideIdButton = async () => {
        sendFriendRequest(user?.id, inputId);
        // console.log('inputid => ', inputId);
        // console.log('  my id => ', user?.id);
    }

    const getFriends = async () => {
        const { data } = await axios.get<User[]>(`http://localhost:8080/user/friend`);
        return data;
    }

    const [friends, setFriends] = useState<User[]>([]);

    const HandleFriendListButton = () => {
        const friendsPromise = getFriends();
        friendsPromise.then((data) => {
            console.log('data => ', data[0]);
            setFriends(data);
        } );
        console.log(friends[0]);
    };

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
            <Button
            variant="contained"
                onClick={handleDecideIdButton}>
                ID決定
            </Button>
            <p></p>
            <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={HandleFriendListButton}
            >
                友達リスト
            </Button>
            <h1>
            {friends.map((friend: User) => (
                <div key={friend.id}>
                    {friend.name}
                </div> // keyプロパティを追加
            ))}
            </h1>
        </div>
    );
}


export default Profile;
