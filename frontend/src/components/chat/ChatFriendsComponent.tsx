import { Avatar, Grid, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import PersonIcon from '@mui/icons-material/Person';
import { Link } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import axios from "axios";
import useQueryFriend from "../../hooks/user/useQueryFriend";
import { WebsocketContext } from "../../contexts/WebsocketContext";
import '../../styles/Chat.css'

type FriendPayload = {
  id: string;
  name: string;
}

type ChatRoomPayload = { [friendId: string]: string };

/**
 * @returns DirectMessage送信可能なフレンド一覧を表示するコンポーネント
 */
export default function ChatFriendsComponent() {
  const socket: Socket = useContext(WebsocketContext);
  const UserID = 'ba822ee0-7a6e-43a8-98cc-eb93f7433bb5'; // tmp
  const { data: friendData } = useQueryFriend(UserID);
  const [friends, setFriends] = useState<FriendPayload[]>([]);

  const getUserDM = async (): Promise<ChatRoomPayload> => {
    try {
      const res = await axios.get(`http://localhost:8080/chat/dm/${UserID}`);
      const updatedRooms: ChatRoomPayload = {};
      res.data.map((room: any) => {
        room.members.map((member: any) => {
          if (UserID !== member.userId)
          updatedRooms[member.userId] = room.id;
        });
      });
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
        return newRoomId;
      } catch (error) {
        console.log(error);
      }
      return "";
    };

    const loadFriends = async () => {
      const updatedRooms = await getUserDM();
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

    loadFriends();
  }, [friendData]);

  useEffect(() => {
    socket.on('create_dmRoom', () => {
      console.log('crateDMRoom');
    })
  }, [])

  const handleClick = (roomId: string) => {
    console.log('click friend button');
    socket.emit('create_dmRoom', { id: roomId})
  }

  return (
    <Stack spacing={2} sx={{ backgroundColor: '#141E61' }} height={'91vh'}>
      {friends?.map((friend, idx) => (
        <Grid container key={idx}>
          <Grid item mr={2}>
            <Avatar ><PersonIcon /></Avatar>
          </Grid>
          <Grid item>
            <Link to={`/chat/room/${friend.id}`} onClick={() => handleClick(friend.id)} className={'FriendLink'}>
              <Typography variant="subtitle1">{friend.name}</Typography>
            </Link>
          </Grid>
        </Grid>
      ))}
    </Stack>
  )
}
