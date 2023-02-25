import { Grid } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Socket } from "socket.io-client";
import ChatGroupComponent from "./ChatGroupCompoent";
import { WebsocketContext } from "../../contexts/WebsocketContext";

type Props = {
  iam: { key: string }
}


/**
 * @returns chat画面のコンポーネント
 */
export default function ChatComponent() {
  const socket: Socket = useContext(WebsocketContext);
  const [iam, setIam] = useState<Props>();

  useEffect(() => {
    socket.on('connect', () => {
      console.log(`Connect: ${socket.id}`);
    });

    socket.on('token', (token: {key: string}) => {
      setIam({ iam: token });
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
      <Outlet context={iam}/>
    </Grid>
  )
}
