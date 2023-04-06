import React, {useEffect, useState} from 'react';
import {Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import {User} from "../../types/PrismaType";

const NotificationButton = () => {
    const [friendIds, setFriendIds] = useState<string[]>([]);
    const [nbNotification, setNbNotification] = useState<number>(0);
    const [showRequests, setShowRequests] = useState<boolean>(false);
    const [user, setUser] = useState<User>();

    useEffect(() => {
        const people = axios.get<string[]>(`http://localhost:8080/user/friendReq`);
        people.then((res) => {
            setFriendIds(res.data);
            setNbNotification(res.data.length);
        });
    }, []);


    const ItemToName = (item: string) => {
        const otherPerson = axios.get<User>(`http://localhost:8080/user/id`, {
            params: {
                id: item
            }
        });
        otherPerson.then((res) => {
            setUser(res.data);
            console.log(res.data);
            console.log(user);
            return res.data.name;
        }, (err) => {
            console.log(err);
        });
        return "error";
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
