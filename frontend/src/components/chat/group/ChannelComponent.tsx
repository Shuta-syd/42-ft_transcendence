import { Box, CircularProgress, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Socket } from "socket.io-client";
import { ChatRoom } from "../../../types/PrismaType";
import ChannelGroupComponent from "./ChannelGroupComponent";
import useSocket from "../../../hooks/useSocket";
import { getChannels } from "../../../utils/chat/ChatAxios";


/**
 * @returns Channel画面のコンポーネント
 */
export default function ChannelComponent() {
  const socket: Socket = useSocket('http://localhost:8080/chat');
  const [channels, setChannels] = useState<ChatRoom[]>([]);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      setLoading(true);
      getChannels().then((res: ChatRoom[]) => setChannels(res));
    } catch (error) {
      alert('チャンネル取得に失敗しました。ブラウザをリフレッシュしてください');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  }, [])

  if (Loading) {
    return (
      <Box height={'100vh'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box height={'10vh'} width={'10vw'}>
          <CircularProgress />
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Box
        height={'100vh'}
        borderLeft={2}
        borderColor={'#EDF0F4'}
        borderRadius={8}
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <Grid container height={'95vh'}>
          <ChannelGroupComponent socket={socket} channels={channels} setChannels={setChannels} />
          <Outlet context={{ socket, setChannels, channels}} />
        </Grid>
      </Box>
    </>
  )
}
