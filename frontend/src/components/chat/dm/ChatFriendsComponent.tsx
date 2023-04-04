import { Avatar, Box, CircularProgress, Grid, Typography } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import axios from "axios";
import '../../../styles/Chat.css'
import { ChatRoom } from "../../../types/PrismaType";
import LeaveButton from "../utils/LeaveButton";


type ChatFriendsComponentProps = {
  userName: string;
  socket: Socket;
  DMRooms: ChatRoom[];
  setDMRooms: any; // useState setter
  isLeave: boolean;
}

/**
 * @returns DirectMessage送信可能なフレンド一覧を表示するコンポーネント
 */
export default function ChatFriendsComponent(props: ChatFriendsComponentProps) {
  const { socket, setDMRooms, DMRooms, isLeave, userName } = props;
  const roomID = useLocation().pathname.split('/')[3];
  const [prevRoomId, setPrevRoomId] = useState<string>();
  const [Loading, setLoading] = useState(true);

  const getFriendNameFromRoomName = (room: string): string => {
    let friendName: string = '';

    const names = room.split(',');
    names.map((name) => {
      if (name !== userName) {
        friendName = name;
      }
    })
    return friendName;
  }

  const getUserDM = async () => {
    const { data } = await axios.get(`http://localhost:8080/chat/dm`);
    if (data) {
      setDMRooms([]);
      data.map((room: any) => {
        const friendName = getFriendNameFromRoomName(room.name);
        const friend = room.members.filter((member: any) => member.user.name === friendName);

        const newDMRoom = {
          id: room.id,
          name: friendName,
          image: friend[0].user.image,
        }
        setDMRooms((prev: any) => [...prev, newDMRoom]);
      })
    }
  }

  useEffect(() => {
    try {
      setLoading(true);
      getUserDM();
    } catch (error) {
      alert('DM取得に失敗しました。ブラウザをリフレッシュしてください');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  }, [userName])


  useEffect(() => {
    if (prevRoomId)
      socket.emit('leave_chat_room', { id: prevRoomId });
    socket.emit('join_chat_room', { id: roomID });
    socket.emit('join_chat_room', { id: roomID });
    setPrevRoomId(roomID);
  }, [roomID, socket])

  const handleClick = (roomId: string) => {
    socket.emit('join_chat_room', { id: roomId })
  }

  if (Loading) {
    return (
      <>
        <Box height={'3rem'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress/>
        </Box>
      </>
    )
  }

  return (
    <>
      {DMRooms?.map((room, idx) => (
        <Link to={`/chat/room/${room.id}`} onClick={() => handleClick(room.id)} className={'FriendLink'} key={idx}>
          {room.id === roomID ? (
            <Grid
              container height={'7vh'}
              sx={{ display: 'flex', alignItems: 'center' }}
              className={'FriendListActive'}
            >
              <Grid item mr={2} ml={3}>
                <Avatar src={`${room.image}`} />
              </Grid>
              <Grid item>
                <Typography variant="subtitle1">
                  {room.name}
                </Typography>
              </Grid>
              {isLeave ? (
              <Grid item>
                <LeaveButton roomId={room.id} setChannels={setDMRooms} channels={DMRooms} />
              </Grid>
            ) : (<></>)}
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
                {room.name}
              </Typography>
              </Grid>
              {isLeave ? (
              <Grid item>
                <LeaveButton roomId={room.id} setChannels={setDMRooms} channels={DMRooms} />
              </Grid>
            ) : (<></>)}
            </Grid>
          )}
        </Link>
      ))}
    </>
  )
}
