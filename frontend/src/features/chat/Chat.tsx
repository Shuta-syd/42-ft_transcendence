import React from "react";
import ChatComponent from "../../components/chat/ChatComponent";
import { socket, WebsocketProvider } from "../../contexts/WebsocketContext";

function Chat() {
  return (
    <div className="Chat">
      <WebsocketProvider value={socket}>
        <ChatComponent />
      </WebsocketProvider>
    </div>
  );
}

export default Chat;
