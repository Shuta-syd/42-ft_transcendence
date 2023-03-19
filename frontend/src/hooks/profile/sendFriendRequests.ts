import axios from 'axios';

export async function sendFriendRequest(userId: string | undefined, friendId: string) {
    try {
        const response = await axios({
            method: 'patch',
            url: 'http://localhost:8080/user/friend',
            data: {
                friendId,
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export default sendFriendRequest;
