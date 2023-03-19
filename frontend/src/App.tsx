import React from "react";
import {Route, Routes } from 'react-router-dom';
import axios from "axios";
import Auth from "./features/auth/Auth";
import Chat from "./features/chat/Chat";
import ChatComponent from "./components/chat/ChatComponent";
import ChatWindowComponent from "./components/chat/ChatWindowComponent";
import Matches from "./features/match/Match";
import Channel from "./features/channel/Channel";
import ChannelComponent from "./components/channel/ChannelComponent";
import ChannelWindowComponent from "./components/channel/ChannelWindowComponent";
import GameMatching from "./features/game/GameMatching";
import GamePlayer1 from "./features/game/GamePlayer1";
import GamePlayer2 from "./features/game/GamePlayer2";
import GameObserver from "./features/game/GameObserver";
import CreateGameRoom from "./features/game/CreateGameRoom";
import GameSelectRoom from "./features/game/GameSelectRoom";

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
              <Route path=":roomId" element={<ChannelWindowComponent />} />
            </Route>
          </Route>
          <Route path="/match" element={<Matches/>}/>
          <Route path="/game" element={<GameMatching/>} />
           <Route path="/game/player1" element={<GamePlayer1/>} />
           <Route path="/game/player2" element={<GamePlayer2/>} />
          <Route path="/game/observer" element={<GameObserver/>} />
          <Route path="/game/select_room" element={<GameSelectRoom/>} />
          <Route path="/game/CreateGameRoom" element={<CreateGameRoom/>} />
        </Routes>
    </>
  )
}
export default App;
