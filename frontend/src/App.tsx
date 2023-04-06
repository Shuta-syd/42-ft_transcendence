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
import GamePlayer1 from "./features/game/GamePlayer1";
import GamePlayer2 from "./features/game/GamePlayer2";
import GameObserver from "./features/game/GameObserver";
import CreateGameRoom from "./features/game/CreateGameRoom";
import GameSelectRoom from "./features/game/GameSelectRoom";
import InviteRoom from "./features/game/InviteRoom";
import JoinInvitedRoom from "./features/game/JoinInvitedRoom";
import NewNavBar from './components/utils/NewNavbar';
import PrivateRouter from "./utils/PrivateRouter";
import ProfileRouting from "./features/profile/ProfileRouting";
import MyProfile from "./features/profile/MyProfile";


function App() {
  axios.defaults.withCredentials = true;
  const path = useLocation().pathname;

  // @ts-ignore
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
          <Route path="/game" element={<GameMatching />} />
            <Route path="/game/player1" element={<GamePlayer1/>} />
            <Route path="/game/player2" element={<GamePlayer2/>} />
          <Route path="/game/observer" element={<GameObserver/>} />
          <Route path="/game/select_room" element={<GameSelectRoom/>} />
          <Route path="/game/game_room" element={<CreateGameRoom/>} />
          <Route path="/game/invite_room" element={<InviteRoom/>} />
          <Route path="/game/join_invited_room" element={<JoinInvitedRoom></JoinInvitedRoom>} />
          <Route path={"/user"} element={<MyProfile />}/>
          <Route path={"/user/:name"} element={<ProfileRouting />}/>
        </Routes>
      </Grid>
    </Grid>
  )
}
export default App;
