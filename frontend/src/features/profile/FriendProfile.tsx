import React from 'react';
import {User} from "../../types/PrismaType";

interface FriendProfileProps {
    friend: User | undefined;
}

const FriendProfile = (props: FriendProfileProps) => {
    console.log('FriendProfile');
    return (
        <div>
            {props.friend?.name}
        </div>
    );
}

export default FriendProfile;
