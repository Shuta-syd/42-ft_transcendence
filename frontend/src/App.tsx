/* eslint-disable import/no-extraneous-dependencies */
import { Box } from "@mui/system";
import React from "react";
import {Route, Routes } from 'react-router-dom';
import Home from "./features/home/Home";
import Chat from "./features/chat/Chat";

function App() {
  return (
    <Box>
        <Routes>
          <Route index element={<Home/>} />
          <Route path="/chat" element={<Chat/>} />
        </Routes>
    </Box>
  )
}

export default App;
