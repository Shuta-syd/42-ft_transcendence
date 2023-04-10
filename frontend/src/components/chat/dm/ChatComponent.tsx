import { Box, CircularProgress, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import getUserName from "../../../utils/getUserName";
import ChatGroupComponent from "./ChatGroupComponent";


/**
 * @returns chat画面のコンポーネント
 */
export default function ChatComponent() {
  const [userName, setUserName] = useState('');
  const socket: Socket = io('http://localhost:8080/chat')
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      getUserName().then((name) => { setUserName(name); });
    } catch (error) {
      alert('ユーザ名取得に失敗しました');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
  }, [])

  useEffect(() => {
    socket.on('connect', () => {
      console.log(`[DM] Connect: ${socket.id}`);
    });

    return () => {
      console.log(`[DM] Disconnect: ${socket.id}`);
      socket.disconnect();
    }
  }, [socket])

  if (Loading) {
    <Box height={'100vh'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Box height={'10vh'} width={'10vw'}>
      <CircularProgress/>
    </Box>
  </Box>
  }

  return (
    <Box
    height={'100vh'}
    borderLeft={2}
    borderColor={'#EDF0F4'}
    borderRadius={8}
    sx={{ display: 'flex', alignItems: 'center' }}
  >
      <Grid container height={'95vh'}>
        <ChatGroupComponent socket={socket} />
        <Outlet context={{socket, userName}} />
      </Grid>
    </Box>
  )
}
