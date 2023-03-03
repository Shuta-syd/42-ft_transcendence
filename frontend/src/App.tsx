import React from "react";
import {Route, Routes } from 'react-router-dom';
import axios from "axios";
import Auth from "./features/auth/Auth";
import Chat from "./features/chat/Chat";
import ChatComponent from "./components/chat/ChatComponent";
import ChatWindowComponent from "./components/chat/ChatWindowComponent";
import Canvas from "./features/game/Game";
import Matches from "./features/match/Match";
import Channel from "./features/channel/Channel";
import ChannelComponent from "./components/channel/ChannelComponent";

function App() {
  axios.defaults.withCredentials = true;
  return (
    <>
        <Routes>
          <Route index element={<Auth/>} />
          <Route path="/chat" element={<Chat />}>
            <Route path="room" element={<ChatComponent />}>
              <Route path=":roomId" element={<ChatWindowComponent />} />
            </Route>
          </Route>
          <Route path="/channel" element={<Channel />}>
            <Route path="room" element={<ChannelComponent />}>
            </Route>
          </Route>
          <Route path="/game" element={<Canvas/>} />
          <Route path="/match" element={<Matches/>}/>
        </Routes>
    </>
  )
}
export default App;
