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

  const getUserDM = async (): Promise<ChatRoomPayload> => {
    if (Object.keys(rooms).length === friends.length)
      return rooms;
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
      return updatedRooms;
    } catch (error) {
      console.log(error);
    }
    return {};
  };

  useEffect(() => {
    const createDMRoom = async (userID: string, friendId: string): Promise<string> => {
      try {
        const roomCrateDto = { isDM: true, userId: userID };
        const room = await axios.post(`http://localhost:8080/chat/room`, roomCrateDto);
        const addMemberDto = { userId: friendId, roomId: room.data.id };
        await axios.post(`http://localhost:8080/chat/member/add`, addMemberDto);
        const newRoomId = room.data.id;
        setRooms(prevRooms => ({ ...prevRooms, [friendId]: newRoomId }));
        return newRoomId;
      } catch (error) {
        console.log(error);
      }
      return "";
    };

    const fetchFriends = async () => {
      const updatedRooms = await getUserDM();
      console.log('rooms:', updatedRooms);
      if (friendData) {
        const updatedFriends = friendData.map(async (friend) => {
          const roomId: string | undefined = updatedRooms[friend.id];
          if (roomId === undefined) {
            const newRoomId = await createDMRoom(UserID, friend.id);
            return { id: newRoomId, name: friend.name };
          }
          return { id: roomId, name: friend.name };
        });

        Promise.all(updatedFriends).then((friendsArray) => {
          setFriends(friendsArray);
        });
      }
    };

    fetchFriends();
  }, [friendData]);

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
