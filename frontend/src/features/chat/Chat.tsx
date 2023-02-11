import React from "react";
import ChatComponent from "../../components/ChatComponent";
import Websocket from "../../components/Websocket";
import { socket, WebsocketProvider } from "../../contexts/WebsocketContext";

function Chat() {
  return (
    <div className="Chat">
      <WebsocketProvider value={socket}>
        <Websocket />
        <ChatComponent />
      </WebsocketProvider>
    </div>
  );
}

export default Chat;
