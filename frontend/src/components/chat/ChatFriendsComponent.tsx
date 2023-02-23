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
  const UserID = 'ba822ee0-7a6e-43a8-98cc-eb93f7433bb5'; // tmp
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
  }, [rooms]);

  useEffect(() => {
    // const createDMRoom = async (userID: string, friendId: string) => {
    //   try {
    //     const roomCrateDto = { isDM: true, userId: userID };
    //     const res = await axios.post(`http://localhost:8080/chat/room`, roomCrateDto).then(async (room) => {
    //       const addMemberDto = { useId: friendId, roomId: room.data.id }
    //       await axios.post(`http://localhost:8080/chat/member`, addMemberDto);
    //     })
    //     console.log(res);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }

    if (friendData && Object.keys(rooms).length > 0) {
      const updatedFriends = friendData.map((friend) => {
        if (rooms[friend.id] === undefined) {
            console.log(1);
        }
        return  {id: rooms[friend.id], name: friend.name}
      });
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
