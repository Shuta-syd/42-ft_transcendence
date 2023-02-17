import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { QueryClient, QueryClientProvider } from "react-query";
import ChatComponent from "../../components/chat/ChatComponent";
import { socket, WebsocketProvider } from "../../contexts/WebsocketContext";

const queryClient = new QueryClient();

function Chat() {
  return (
    <QueryClientProvider client={queryClient}>
      <WebsocketProvider value={socket}>
        <ChatComponent />
      </WebsocketProvider>
    </QueryClientProvider>
  );
}

export default Chat;
