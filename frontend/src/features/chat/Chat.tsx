import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Outlet } from "react-router-dom";
import { socket, WebsocketProvider } from "../../contexts/WebsocketContext";

const queryClient = new QueryClient();

function Chat() {
  return (
    <QueryClientProvider client={queryClient}>
      <WebsocketProvider value={socket}>
        <Outlet />
      </WebsocketProvider>
    </QueryClientProvider>
  );
}

export default Chat;
