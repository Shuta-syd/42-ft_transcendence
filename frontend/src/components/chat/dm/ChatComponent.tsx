import { Box, CircularProgress, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Socket } from "socket.io-client";
import getUserName from "../../../utils/getUserName";
import ChatGroupComponent from "./ChatGroupComponent";
import useSocket from "../../../hooks/useSocket";


/**
 * @returns chat画面のコンポーネント
 */
export default function ChatComponent() {
  const [userName, setUserName] = useState('');
  const socket: Socket = useSocket('http://localhost:8080/chat');
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
    return () => {};
  }, [])

  if (Loading) {
    return (
      <Box height={'100vh'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box height={'10vh'} width={'10vw'}>
          <CircularProgress/>
        </Box>
      </Box>
    )
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
