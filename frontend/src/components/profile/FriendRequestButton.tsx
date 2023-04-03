import React from "react";
import {Button} from "@mui/material";

const FriendRequestButton = () => {
    console.log("Friend Request Button");
    return (
        <>
            <Button
                variant="contained"
                size={"large"}
            >
                Follow
            </Button>
        </>
    );
}


export default FriendRequestButton;
