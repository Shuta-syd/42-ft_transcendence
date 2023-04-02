import React, {useState, useEffect} from 'react';
import {Grid} from "@mui/material"
import {User} from "../../types/PrismaType";

interface FriendProfileProps {
    friend: User | undefined;
}


const FriendProfile = (props: FriendProfileProps) => {
    // prerequisite: friend definition
    // if you pass the info of props, you should change initial value of useState
    const [friendName, setFriendName] = useState<string>('React');
    useEffect(() => {
        console.log(friendName);
        setFriendName('jack');
    }, []);

    return (
        <div
            style={{
                backgroundColor: "#EDF0F4",
                minHeight: "100vh",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <Grid
                container
                direction="column"
            >
                <h1>[{friendName} Profile]</h1>
            </Grid>
        </div>
    );
}

export default FriendProfile;
