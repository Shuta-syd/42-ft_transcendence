import React, {useEffect, useState} from 'react';
import {Badge } from '@mui/material';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationButton = () => {
    const [friendIds, setFriendIds] = useState<string[]>([]);
    const [showRequests, setShowRequests] = useState<boolean>(false);

    useEffect(() => {
        const people = axios.get<string[]>(`http://localhost:8080/user/friendReq`);
        people.then((res) => {
            setFriendIds(res.data);
        });
    }, []);

    const OpenRequests = (props: { ss: string[] }) => {
        const items = props.ss;

        return (
            <ul>
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        );
    }

    const handleClick = () => {
        setShowRequests(!showRequests);
    }

    return (
        <Grid item xs={4}>
            <Badge
                color={"error"}
                overlap="circular"
                badgeContent={friendIds.length}
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
            {showRequests && (
                <div>
                    <OpenRequests ss={friendIds}/>
                </div>
            )}
        </Grid>
    )
}

export default NotificationButton;
