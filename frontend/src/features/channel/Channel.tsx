import React, { useContext } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Outlet } from "react-router-dom";
import { Socket } from "socket.io-client";
import { WebsocketContext, WebsocketProvider } from "../../contexts/WebsocketContext";

const queryClient = new QueryClient();

function Channel() {
  const socket: Socket = useContext(WebsocketContext);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <WebsocketProvider value={socket}>
          <Outlet />
        </WebsocketProvider>
      </QueryClientProvider>
    </>
  )
}

export default Channel;
