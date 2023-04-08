import { Box, Grid } from "@mui/material";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Socket } from "socket.io-client";
import { ChatRoom } from "../../../types/PrismaType";
import ChannelGroupComponent from "./ChannelGroupComponent";
import useSocket from "../../../hooks/useSocket";


/**
 * @returns Channel画面のコンポーネント
 */
export default function ChannelComponent() {
  const socket: Socket = useSocket('http://localhost:8080/chat');
  const [channels, setChannels] = useState<ChatRoom[]>([]);

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
