import React from "react";
import { Route, Routes, useLocation } from 'react-router-dom';
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
import Profile from "./features/profile/Profile";
import GameRouting from "./features/game/GameRouting";

function App() {
  axios.defaults.withCredentials = true;
  const path = useLocation().pathname;

  return (
    <Grid container>
      { path !=='/login' && path !== '/signup' ? <NewNavBar /> : <></>}
      <Grid item xs>
        <Routes>
          <Route path="/login" element={<Auth isLogin={true} />} />
          <Route path="/signup" element={<Auth isLogin={false}/>} />
          <Route path="/chat" element={
            <PrivateRouter>
              <Chat />
            </PrivateRouter>
          }>
            <Route path="room" element={<ChatComponent />}>
              <Route path=":roomId" element={<ChatWindowComponent />} />
            </Route>
          </Route>
          <Route path="/channel" element={
            <PrivateRouter>
              <Channel />
            </PrivateRouter>
          }>
            <Route path="room" element={<ChannelComponent />}>
              <Route path=":roomId" element={<ChannelWindowComponent />} />
            </Route>
          </Route>
          <Route>
            <Route path="/game" element={<GameMatching />} />
            <Route path={"/game/:room"} element={<GameRouting />} />
          </Route>
          <Route path="/user" element={<Profile/>} />
        </Routes>
      </Grid>
    </Grid>
  )
}
export default App;
