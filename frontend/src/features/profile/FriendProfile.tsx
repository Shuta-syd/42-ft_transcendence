import React, {useState, useEffect} from 'react';
import {Grid} from "@mui/material"
import {User} from "../../types/PrismaType";
import ShowAvatar from "../../components/profile/ShowAvatar";

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
                // display: "flex",
                // alignItems: "center",
                // justifyContent: "center"
            }}
        >
            <Grid
                container
                direction="column"
                spacing={2}
            >
                <Grid
                    item xs={5}
                    style={{
                        fontSize: "4rem",
                        fontWeight: "bold"
                    }}
                >
                    [{friendName} Profile]
                </Grid>
                <Grid item xs={5}>
                    <ShowAvatar user={props.friend} profileImage={props.friend?.image} />
                </Grid>
            </Grid>
        </div>
    );
}

export default FriendProfile;
