import { Avatar, Grid, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import PersonIcon from '@mui/icons-material/Person';
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import useQueryFriend from "../../hooks/user/useQueryFriend";

type FriendPayload = {
  id: string;
  name: string;
}

// type ChatRoomPayload = {
//   roomId: string;
//   friendId: string;
// }

/**
 * @returns DirectMessage送信可能なフレンド一覧を表示するコンポーネント
 */
export default function ChatFriendsComponent() {
  const UserID = '32788a21-3d7c-4c2b-8727-e08133c3b293'; // tmp
  const { data } = useQueryFriend(UserID);
  const [friends, setFriends] = useState<FriendPayload[]>([]);
  // const [rooms, setRooms] = useState<ChatRoomPayload[]>([]);

  useEffect(() => {
    setFriends([]);
    if (data) {
      data?.map((obj) => {
        const friend: FriendPayload = { id: obj.id, name: obj.name };
        setFriends(prevFriends => [...prevFriends, friend]);
      })
    }
  }, [data]);

  return (
    <Stack spacing={2} sx={{ backgroundColor: '#d1c4e9' }} height={'91vh'}>
      {friends?.map((friend, idx) => (
        <Grid container key={idx}>
          <Grid item mr={2}>
            <Avatar ><PersonIcon /></Avatar>
          </Grid>
          <Grid item>
            <Link to={`/chat/room/${friend.id}`}>
              <Typography variant="subtitle1">{friend.name}</Typography>
            </Link>
          </Grid>
        </Grid>
      ))}
    </Stack>
  )
}
