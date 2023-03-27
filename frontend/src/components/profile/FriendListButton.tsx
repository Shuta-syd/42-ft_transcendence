import React, {useState} from "react";
import {Button} from "@mui/material";
import {User} from "../../types/PrismaType";

interface Props {
    getFriends: () => Promise<User[]>;
}

const FriendListButton = ({getFriends}: Props) => {
    const [friends, setFriends] = useState<User[]>([]);

    const handleFriendListButton = async () => {
        const data = await getFriends();
        setFriends(data);
    };

    return (
        <div>
            <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={handleFriendListButton}
            >
                friend list
            </Button>
            <h1>
                {friends.map((friend: User) => (
                    <div key={friend.id}>
                        {friend.name}
                    </div>
                ))}
            </h1>
        </div>
    );
}

export default FriendListButton;
