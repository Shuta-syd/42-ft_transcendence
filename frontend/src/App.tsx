import React from "react";
import {Route, Routes } from 'react-router-dom';
import Home from "./features/home/Home";
import Chat from "./features/chat/Chat";
import ChatComponent from "./components/chat/ChatComponent";
import ChatWindowComponent from "./components/chat/ChatWindowComponent";
import Canvas from "./features/game/Game";

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
          <Route path="/game" element={<Canvas/>} />
        </Routes>
    </>
  )
}
export default App;
