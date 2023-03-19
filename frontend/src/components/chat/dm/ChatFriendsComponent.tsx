import { Avatar, Grid, Typography } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import axios from "axios";
import useQueryFriend from "../../../hooks/user/useQueryFriend";
import '../../../styles/Chat.css'
import { ChatRoom } from "../../../types/PrismaType";

type FriendPayload = {
  id: string;
  name: string;
}

type ChatRoomPayload = { [friendId: string]: string };

type ChatFriendsComponentProps = {
  socket: Socket;
  DMRooms: ChatRoom[];
  setDMRooms: any; // useState setter
  isLeave: boolean;
}

/**
 * @returns DirectMessage送信可能なフレンド一覧を表示するコンポーネント
 */
export default function ChatFriendsComponent(props: ChatFriendsComponentProps) {
  const { socket } = props;
  const roomID = useLocation().pathname.split('/')[3];
  const { data: friendData } = useQueryFriend();
  const [friends, setFriends] = useState<FriendPayload[]>([]);
  const [prevRoomId, setPrevRoomId] = useState<string>();

  const getUserDM = async (): Promise<ChatRoomPayload> => {
    try {
      const res = await axios.get(`http://localhost:8080/chat/dm`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
    return {};
  };

  useEffect(() => {
    const createDMRoom = async (friendId: string): Promise<string> => {
      try {
        const roomCrateDto = { type: 'DM' };
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
            const newRoomId = await createDMRoom(friend.id);
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
    socket.on('join_chat_room', () => { });
    socket.on('leave_chat_room', () => { })
  }, [])

  useEffect(() => {
    if (prevRoomId)
      socket.emit('leave_chat_room', { id: prevRoomId });
    socket.emit('join_chat_room', { id: roomID });
    socket.emit('join_chat_room', { id: roomID });
    setPrevRoomId(roomID);
  }, [roomID])

  const handleClick = (roomId: string) => {
    console.log('click friend button');
    socket.emit('join_chat_room', { id: roomId })
  }

  return (
    <>
      {friends?.map((friend, idx) => (
        <Link to={`/chat/room/${friend.id}`} onClick={() => handleClick(friend.id)} className={'FriendLink'} key={idx}>
          {friend.id === roomID ? (
            <Grid
              container height={'7vh'}
              sx={{ display: 'flex', alignItems: 'center' }}
              className={'FriendListActive'}
            >
              <Grid item mr={2} ml={3}>
                <Avatar ><PersonIcon /></Avatar>
              </Grid>
              <Grid item>
                <Typography variant="subtitle1">
                  {friend.name}
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Grid
            container height={'7vh'}
            sx={{ display: 'flex', alignItems: 'center' }}
            className={'FriendList'}
            >
              <Grid item mr={2} ml={3}>
                <Avatar ><PersonIcon /></Avatar>
              </Grid>
              <Grid item>
              <Typography variant="subtitle1">
                {friend.name}
              </Typography>
              </Grid>
            </Grid>
          )}
        </Link>
      ))}
    </>
  )
}
