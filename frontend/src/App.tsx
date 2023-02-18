/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import {Route, Routes } from 'react-router-dom';
import Home from "./features/home/Home";
import Chat from "./features/chat/Chat";
import Game from "./features/game/Game";
import ChatComponent from "./components/chat/ChatComponent";
import ChatWindowComponent from "./components/chat/ChatWindowComponent";

function App() {
  return (
    <>
        <Routes>
          <Route index element={<Home/>} />
          <Route path="/chat" element={<Chat />}>
            <Route path="room" element={<ChatComponent />}>
              <Route path=":roomId" element={<ChatWindowComponent />} />
            </Route>
          </Route>
          <Route path="/game" element={<Game/>} />
        </Routes>
    </>
  )
}

export default App;
