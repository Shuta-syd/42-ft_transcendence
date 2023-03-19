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

        return response.data;
    } catch (error: any) {
        console.error(error);
        return { error: error.message }; // 何かしらの値を返す
    }
}

export default sendFriendRequest;
