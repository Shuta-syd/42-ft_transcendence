/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import {Route, Routes } from 'react-router-dom';
import Home from "./features/home/Home";
import Chat from "./features/chat/Chat";

function App() {
  return (
    <>
        <Routes>
          <Route index element={<Home/>} />
          <Route path="/chat" element={<Chat/>} />
        </Routes>
    </>
  )
}

export default App;
