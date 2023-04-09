import React, { useContext, useEffect } from "react";
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
import GameRouting from "./features/game/GameRouting";
import NewNavBar from './components/utils/NewNavbar';
import PrivateRouter from "./utils/PrivateRouter";
import ProfileRouting from "./features/profile/ProfileRouting";
import { RootWebsocketContext } from "./contexts/WebsocketContext";
import Profile from "./features/profile/Profile";


function App() {
  axios.defaults.withCredentials = true;
  const rootSocket = useContext(RootWebsocketContext);

  useEffect(() => {
      rootSocket.on('connect', () => {
      });
      return () => {
        rootSocket.disconnect();
      }
   }, []);


  return (
    <Grid container>
      <NewNavBar />
      <Grid item xs>
        <Routes>
          <Route path="/login" element={<Auth isLogin={true} />} />
          <Route path="/signup" element={<Auth isLogin={false} />} />
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
              <Profile />
            </PrivateRouter>
          } />
              <Route path={"/user/:name"} element={<ProfileRouting />}/>
          </Routes>
        </Grid>
      </Grid>
  )
}
export default App;
