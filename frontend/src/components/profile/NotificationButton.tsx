import React, {useEffect, useState} from 'react';
import {Badge } from '@mui/material';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationButton = () => {
    const [friendIds, setFriendIds] = useState<string[]>([]);
    const [nbNotification, setNbNotification] = useState<number>(0);
    const [showRequests, setShowRequests] = useState<boolean>(false);

    useEffect(() => {
        const people = axios.get<string[]>(`http://localhost:8080/user/friendReq`);
        people.then((res) => {
            setFriendIds(res.data);
            setNbNotification(res.data.length);
        });
    }, []);


    const ItemToName = (item: string) => {
        const name = axios.get<string>(`http://localhost:8080/user`, {
            params: {id: item}
        }).catch((err) => console.log(err));
        name.then((res) =>
            res?.data
        );
        return item;
    }

    const OpenRequests = (props: { ss: string[] }) => {
        const items = props.ss;

        return (
            <>
                {items.map((item, index) => (
                    <li key={index}>{ItemToName(item)}</li>
                ))}
            </>
        );
    }

    const handleClick = () => {
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
            {showRequests && (<OpenRequests ss={friendIds}/>
            )}
            </Grid>
        </Grid>
    )
}

export default NotificationButton;
