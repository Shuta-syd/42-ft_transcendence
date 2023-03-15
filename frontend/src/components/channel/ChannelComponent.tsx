import { Box, Grid } from "@mui/material";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import NewChannelGroupComponent from "./NewChannelGroupComponent";


/**
 * @returns Channel画面のコンポーネント
 */
export default function ChannelComponent() {
  const socket: Socket = io('http://localhost:8080/chat')

  useEffect(() => {
    socket.on('connect', () => {
      console.log(`Connect: ${socket.id}`);
    })

    return () => {
      console.log(`Disconnect: ${socket.id}`);
      socket.disconnect();
    }
  }, [socket])


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
          <NewChannelGroupComponent socket={socket} />
          <Outlet context={socket}/>
        </Grid>
      </Box>
    </>
  )
}
