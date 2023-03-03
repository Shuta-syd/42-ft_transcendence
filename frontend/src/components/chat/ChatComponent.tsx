import { Grid } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Socket } from "socket.io-client";
import ChatGroupComponent from "./ChatGroupComponent";
import { WebDMsocketContext } from "../../contexts/WebsocketContext";


/**
 * @returns chat画面のコンポーネント
 */
export default function ChatComponent() {
  const socket: Socket = useContext(WebDMsocketContext);

  useEffect(() => {
    socket.on('connect', () => {
      console.log(`Connect: ${socket.id}`);
    });

    socket.on('token', (token: {key: string}) => {
      console.log(token);
    })

    return () => {
      console.log(`Disconnect: ${socket.id}`);
      socket.disconnect();
    }
  }, [])

  return (
    <Grid container>
      <ChatGroupComponent />
      <Outlet />
    </Grid>
  )
}
