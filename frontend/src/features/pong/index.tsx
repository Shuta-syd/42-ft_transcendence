import React, { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import useSocket from '../../hooks/useSocket';
import { fetchProfileUser } from '../../hooks/profile/useProfileUser';
import { User } from '../../types/PrismaType';

const Pong = () => {

    const socket: Socket = useSocket("http://localhost:8080/pong");
    const [user, setUser] = React.useState<User>();

    const UserPromises = fetchProfileUser();
    useEffect(() => {
        UserPromises.then((userDto: User) => {
            setUser(userDto);
        });
    }, []);

    socket.on('pong', (data: string) => {
        console.log(data);
    }
    );

    return (
    <div>
        Hello
        <h1>{user?.name}</h1>
    </div>
    );
}

export default Pong;
