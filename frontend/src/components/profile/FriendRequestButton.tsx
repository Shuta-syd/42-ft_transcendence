import React, { useState } from "react";
import { Button } from "@mui/material";

const FriendRequestButton = () => {
    const [isFollowing, setIsFollowing] = useState(false);

    const handleClick = () => {
        console.log("Friend Request Button");
        setIsFollowing(!isFollowing);
    };

    /* 既存APIを用いて、friend reqを調整する */

    return (
        <>
            <Button
                variant="contained"
                size={"large"}
                onClick={handleClick}
            >
                {isFollowing ? "Unfollow" : "Follow"}
            </Button>
        </>
    );
};

export default FriendRequestButton;
