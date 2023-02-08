import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Chat from "../features/chat/Chat";
import Home from "../features/home/Home";
import Navbar from "./Navbar";

function Header() {
  return (
    <div>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route index element={<Home/>} />
          <Route path="/chat" element={<Chat/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default Header;
