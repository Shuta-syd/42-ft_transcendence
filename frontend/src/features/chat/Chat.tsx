import React from "react";
import Websocket from "../../components/Websocket";
import { socket, WebsocketProvider } from "../../contexts/WebsocketContext";

function Chat() {
  return (
    <div className="Chat">
      <WebsocketProvider value={socket}>
        <Websocket/>
      </WebsocketProvider>
    </div>
  );
}

export default Chat;
