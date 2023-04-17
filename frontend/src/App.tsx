import React from "react";
import { Route, Routes } from 'react-router-dom';
import { Grid } from "@mui/material";
import axios from "axios";
import Auth from "./features/auth/Auth";
import Chat from "./features/chat/Chat";
import ChatComponent from "./components/chat/dm/ChatComponent";
import ChatWindowComponent from "./components/chat/dm/ChatWindowComponent";
import Channel from "./features/channel/Channel";
import ChannelComponent from "./components/chat/group/ChannelComponent";
import ChannelWindowComponent from "./components/chat/group/ChannelWindowComponent";
import GameMatching from "./features/game/GameMatching";
import NewNavBar from './components/utils/NewNavbar';
import PrivateRouter from "./utils/PrivateRouter";
import ProfileRouting from "./features/profile/ProfileRouting";
import useSocket from "./hooks/useSocket";
import { RootWebsocketProvider } from "./contexts/WebsocketContext";
import MyProfile from "./features/profile/MyProfile";
import GameRouting from "./features/game/GameRouting"
import Pong from "./features/pong";

function App() {
  axios.defaults.withCredentials = true;
  const rootSocket = useSocket('http://localhost:8080/');

  return (
      <RootWebsocketProvider value={rootSocket}>
      <Grid container>
        <NewNavBar />
        <Grid item xs>
          <Routes>
            <Route path="/login" element={<Auth type={'login'} />} />
            <Route path="/signup" element={<Auth type={'signup'} />} />
            <Route path="/signup/42" element={<Auth type={'signup/42'} />} />
            <Route
              path="/chat"
              element={
              <PrivateRouter>
                <Chat />
              </PrivateRouter>
            }>
              <Route path="room" element={<ChatComponent />}>
                <Route path=":roomId" element={<ChatWindowComponent />} />
              </Route>
            </Route>
            <Route
              path="/channel"
              element={
                <PrivateRouter>
                <Channel />
              </PrivateRouter>
            }>
              <Route path="room" element={<ChannelComponent />}>
                <Route path=":roomId" element={<ChannelWindowComponent />} />
              </Route>
            </Route>
            <Route
              path="/game"
              element={
              <PrivateRouter>
                <GameMatching/>
              </PrivateRouter>
            } />
              <Route path={"/game/:room"} element={<GameRouting />} />
            <Route
              path={"/user"}
              element={
              <PrivateRouter>
                <MyProfile />
              </PrivateRouter>
            } />
                <Route path={"/user/:name"} element={<ProfileRouting />}/>
            <Route
              path={"/pong"}
              element={<Pong />}>
            </Route>
            </Routes>
          </Grid>
        </Grid>
      </RootWebsocketProvider>
  )
}
export default App;
