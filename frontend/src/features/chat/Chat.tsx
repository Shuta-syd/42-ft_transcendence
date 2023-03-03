import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Outlet } from "react-router-dom";
import { DMsocket, WebDMsocketProvider } from "../../contexts/WebsocketContext";

const queryClient = new QueryClient();

function Chat() {
  return (
    <QueryClientProvider client={queryClient}>
      <WebDMsocketProvider value={DMsocket}>
        <Outlet />
      </WebDMsocketProvider>
    </QueryClientProvider>
  );
}

export default Chat;
