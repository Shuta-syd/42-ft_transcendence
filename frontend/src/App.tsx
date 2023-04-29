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
import Page404 from "./utils/Page404";

function App() {
  axios.defaults.withCredentials = true;
  const rootSocket = useSocket('http://localhost:8080/');

  const refreshClient = axios.create();

  axios.interceptors.response.use(
    (response) => response,
    async (error:any) => {

      if (error.response.status === 401) {
        const res = refreshClient.get('http://localhost:8080/auth/refresh').catch((err) => {
          window.location.href = 'http://localhost:3000/login';
        })
        return res
      }
      return Promise.reject(error);
    }
  )

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
            <Route path={"/user/:name"} element={
              <PrivateRouter>
                <ProfileRouting />
              </PrivateRouter>
            } />
            <Route path="*" element={
                <Page404 />
            } />
          </Routes>
          </Grid>
        </Grid>
      </RootWebsocketProvider>
  )
}

export default App;
