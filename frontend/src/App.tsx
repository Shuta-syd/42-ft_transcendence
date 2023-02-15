/* eslint-disable import/no-extraneous-dependencies */
import { Container } from "@mui/system";
import React from "react";
import {Route, Routes } from 'react-router-dom';
import Home from "./features/home/Home";
import Chat from "./features/chat/Chat";
import Canvas from "./features/game/Game";

function App() {
    return (
        <Container maxWidth="xl">
            <Routes>
                <Route index element={<Home/>} />
                <Route path="/chat" element={<Chat/>} />
                <Route path="/game" element={<Canvas/>} />
            </Routes>
        </Container>
    )
}

export default App;