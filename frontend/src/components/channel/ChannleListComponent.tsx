import { Avatar, Grid, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useLayoutEffect } from "react"
import { Socket } from "socket.io-client";
import { Link, useLocation } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import { ChatRoom } from "../../types/PrismaType";
import '../../styles/Chat.css'

type ChannelListComponentProps = {
  socket: Socket;
  channels: any;
  setChannels: any; // useState setter
}

/**
 * @returns Message送信可能なChannel一覧を表示するコンポーネント
 */
export default function ChannelListComponent(props: ChannelListComponentProps) {
  const { socket, channels, setChannels } = props;
  const roomID = useLocation().pathname.split('/')[3];

  const getChannels = async (): Promise<ChatRoom[]> => {
    try {
      const res = await axios.get(`http://localhost:8080/chat/group`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
    return [];
  }

  useEffect(() => {
    socket.on('joinRoom', () => {})
  }, []);

  useEffect(() => {
    socket.emit('joinRoom', { id: roomID });
  }, [roomID]);

  useLayoutEffect(() => {
    getChannels().then((data) => { setChannels(data); })
  }, [])

    const handleClick = (roomId: string) => {
      console.log('click channel button');
      socket.emit('joinRoom', { id: roomId });
    }

  return (
    <>
      {channels.map((room: ChatRoom, idx: number) => (
        <Link to={`/channel/room/${room.id}`} onClick={() => handleClick(room.id)} key={idx} className={'ChannelLink'}>
          {room.id === roomID ? (
            <Grid container padding={1} className={'ChannelListActive'}>
              <Grid item mr={2}>
                <Avatar ><PersonIcon /></Avatar>
              </Grid>
              <Grid item>
                <Typography variant="subtitle1" sx={{fontWeight: 700}} >{room.name}</Typography>
                </Grid>
            </Grid>
          ): (
            <Grid container padding={1} className={'ChannelList'}>
              <Grid item mr={2}>
                <Avatar ><PersonIcon /></Avatar>
              </Grid>
              <Grid item>
              <Typography variant="subtitle1" sx={{fontWeight: 700}} >{room.name}</Typography>
              </Grid>
            </Grid>
          )}
        </Link>
      ))}
    </>
  )
}
