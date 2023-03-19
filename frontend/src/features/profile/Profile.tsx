import React, {useEffect, useState } from 'react';
import { User } from "../../types/PrismaType";
import { useProfileUser } from "../../hooks/profile/useProfileUser";

const Profile = () => {
    const [user, setUser] = useState<User>();

    const UserPromises = useProfileUser();
    useEffect(() => {
        UserPromises.then((userDto: User) => {
            setUser(userDto);
        });
    }, []);

    return (
        <div>
            <h1>{user?.name}</h1>
        </div>
    );
}


export default Profile;
