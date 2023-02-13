import React from "react";
import ChatComponent from "../../components/chat/ChatComponent";
import { socket, WebsocketProvider } from "../../contexts/WebsocketContext";

function Chat() {
  return (
    <>
      <WebsocketProvider value={socket}>
        <ChatComponent />
      </WebsocketProvider>
    </>
  );
}

export default Chat;
