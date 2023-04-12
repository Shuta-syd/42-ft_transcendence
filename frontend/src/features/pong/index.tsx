import React, { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import useSocket from '../../hooks/useSocket';
import { fetchProfileUser } from '../../hooks/profile/useProfileUser';
import { User } from '../../types/PrismaType';

const Pong = () => {

    const socket: Socket = useSocket("http://localhost:8080/pong");
    const [user, setUser] = React.useState<User>();
    const [groupId, setGroupId] = React.useState<string>('');

    // fetch user
    const UserPromises = fetchProfileUser();
    useEffect(() => {
        UserPromises.then((userDto: User) => {
            setUser(userDto);
        });
    }, []);

    // send match request
    useEffect(() => {
        socket.emit('match_request');

        socket.on('match_found', (groupIdDto: string) => {
            console.log('match found! GroupId = ', groupIdDto);
            setGroupId(groupIdDto);
        });

        // return () => {
        //     socket.off('match_found');
        // }
    }, []);

    useEffect(() => {
        if (groupId === '') return;
        socket.emit('join_group', groupId);
    }, [groupId]);


    return (
    <div>
        <h1>{user?.name}</h1>
        {groupId ? (
            <p>Match found! Group ID: {groupId}</p>
        ) : (
            <p>Waiting for a match...</p>
        )}

    </div>
    );
}

export default Pong;
