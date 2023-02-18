/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import {Route, Routes } from 'react-router-dom';
import Home from "./features/home/Home";
import Chat from "./features/chat/Chat";
import Game from "./features/game/Game";

function App() {
  return (
    <>
        <Routes>
          <Route index element={<Home/>} />
          <Route path="/chat" element={<Chat/>} />
          <Route path="/game" element={<Game/>} />
        </Routes>
    </>
  )
}

export default App;
