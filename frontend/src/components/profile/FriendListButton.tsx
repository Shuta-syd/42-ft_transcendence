import React from "react";
import { User} from "../../types/PrismaType";

interface FriendListButtonProps {
    user: User | undefined;
}

const FriendListButton = (props: FriendListButtonProps) => {
    console.log("Friend List Button");

    return (
        <>

        </>
    );
}

export default FriendListButton;
