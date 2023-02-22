import { Avatar, Grid, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import PersonIcon from '@mui/icons-material/Person';
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import useQueryFriend from "../../hooks/user/useQueryFriend";

type FriendPayload = {
  id: string;
  name: string;
}

type ChatRoomPayload = { [friendId: string]: string };

/**
 * @returns DirectMessage送信可能なフレンド一覧を表示するコンポーネント
 */
export default function ChatFriendsComponent() {
  const UserID = '32788a21-3d7c-4c2b-8727-e08133c3b293'; // tmp
  const { data: friendData } = useQueryFriend(UserID);
  const [friends, setFriends] = useState<FriendPayload[]>([]);
  const [rooms, setRooms] = useState<ChatRoomPayload>({});

  useEffect(() => {
    const getUserDM = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/chat/dm/${UserID}`);
        const updatedRooms: ChatRoomPayload = {};
        res.data.map((room: any) => {
          room.members.map((member: any) => {
            if (UserID !== member.userId)
              updatedRooms[member.userId] = room.id;
          });
        });
        setRooms(updatedRooms);
      } catch (error) {
        console.log(error);
      }
    };

    getUserDM();
  }, []);

  useEffect(() => {
    if (friendData && Object.keys(rooms).length > 0) {
      const updatedFriends = friendData.map((obj) => ({ id: rooms[obj.id], name: obj.name }));
      setFriends(updatedFriends);
    }
  }, [friendData, rooms]);

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
