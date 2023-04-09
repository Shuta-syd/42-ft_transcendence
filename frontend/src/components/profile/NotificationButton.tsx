import React, { useEffect, useState } from "react";
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardActions,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { User } from "../../types/PrismaType";

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

    // [memo]
    // accept or declineをしたuserに関してはfriendReqから削除するAPIが必要になる

    const handleAccept = (acceptPersonId: string) => {
        console.log("accept", acceptPersonId);
        // @patch http://localhost:8080/user/friendReqでacceptできる
        // bodyはfriend idのみ
        const res = axios.patch<User>('http://localhost:8080/user/friendReq', {friendId: acceptPersonId});
        res.then((response) => {
            console.log(response);
        }).catch((err) => {
            console.log(err);
        })
    }

    const handleDecline = (declinePersonId: string) => {
        console.log("decline", declinePersonId);
        // @delete http://localhost:8080/user/friendReqでacceptできる
        // bodyはfriend idのみ
        const res = axios.delete<User>('http://localhost:8080/user/friendReq', {
            data: {friendId: declinePersonId}
        });
        res.then((response) => {
            console.log(response);
        }).catch((err) => {
            console.log(err);
        })
    }

    // fs is an array of friend
    const OpenRequests = () => (
        <Box
            style={{
                position: "absolute",
                color: "#B2B9C5",
                maxWidth: "400px",
            }}
        >
            {friends.map((f) => (
                <Card
                    key={f.id}
                    sx={{
                        marginBottom: "1rem",
                        backgroundColor: "#EDF0F4",
                }}>
                    <CardContent>
                        <Typography variant="h6" component="h2">
                            Friend request from {f.name}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleAccept(f.id)}
                        >
                            Accept
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleDecline(f.id)}
                        >
                            Decline
                        </Button>
                    </CardActions>
                </Card>
            ))}
        </Box>
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
