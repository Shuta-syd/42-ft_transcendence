import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { ChatRoom } from "../../../types/PrismaType";
import ChannelGroupComponent from "./ChannelGroupComponent";


/**
 * @returns Channel画面のコンポーネント
 */
export default function ChannelComponent() {
  const socket: Socket = io('http://localhost:8080/chat');
  const [channels, setChannels] = useState<ChatRoom[]>([]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log(`[Channel] Connect: ${socket.id}`);
    })

    return () => {
      console.log(`[Channel] Disconnect: ${socket.id}`);
      socket.disconnect();
    }
  }, [socket]);


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
