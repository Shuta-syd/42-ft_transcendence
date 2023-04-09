import React, {useEffect, useState} from 'react';
import {Badge, Button } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import {User} from "../../types/PrismaType";

const NotificationButton = () => {
    const [friendIds, setFriendIds] = useState<string[]>([]);
    const [friends, setFriends] = useState<User[]>([]);
    const [nbNotification, setNbNotification] = useState<number>(0);
    const [showRequests, setShowRequests] = useState<boolean>(false);
    // const [user, setUser] = useState<User>();

    useEffect(() => {
        /* requestしてきたpeopleをfetch */
        const reqPeople = axios.get<string[]>(`http://localhost:8080/user/friendReq`);
        reqPeople.then((res) => {
            setFriendIds(res.data);
            setNbNotification(res.data.length);
        });
    }, []);

    useEffect(() => {
        // friendIdsに応じたidからuserを取得して、friendsに格納していく
        friendIds.forEach((id) => {
            const friend = axios.post<User>(`http://localhost:8080/user/id`, {id});
            console.log(friend);
            friend.then((res) => {
                setFriends((prev) => [...prev, res.data]);
            });
        });
    }, [friendIds]);


    // fs is an array of friend
    const OpenRequests = () => (
        <div
            style={{
                position: "absolute",
                color: "#B2B9C5"
            }}
        >
            {friends.map((f) => (
                <React.Fragment
                    key={f.id}>
                    <h2>・friend request from {f.name}</h2>
                    <Button
                        variant="contained"
                    >
                        Accept
                    </Button>
                    <Button
                        variant="outlined"
                    >
                        Decline
                    </Button>
                </React.Fragment>
            ))}
        </div>
    );

    const handleClick = () => {
        console.log("clicked");
        setShowRequests(!showRequests);
    }

    return (
        <Grid item xs={5}>
            <Badge
                color={"error"}
                overlap="circular"
                badgeContent={nbNotification}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <NotificationsIcon
                    sx={{
                        color: "blue",
                        fontSize: "4rem",
                    }}
                    onClick={handleClick}
                />
            </Badge>
            <Grid>
            {showRequests && (<OpenRequests/>)}
            </Grid>
        </Grid>
    )
}

export default NotificationButton;
