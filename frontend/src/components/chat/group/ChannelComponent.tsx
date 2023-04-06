import { Box, Grid } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { ChatRoom } from "../../../types/PrismaType";
import ChannelGroupComponent from "./ChannelGroupComponent";


/**
 * @returns Channel画面のコンポーネント
 */
export default function ChannelComponent() {
  const socket: Socket = io('http://localhost:8080/chat');
  const didLogRef = useRef(false);
  const [channels, setChannels] = useState<ChatRoom[]>([]);

  useEffect(() => {
    if (didLogRef.current === false) {
      didLogRef.current = true;
      socket.on('connect', () => {
      })

      return () => {
        socket.disconnect();
      }
    }
    return () => {};
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
