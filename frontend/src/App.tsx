import React from "react";
import { Route, Routes } from 'react-router-dom';
import { Grid } from "@mui/material";
import axios from "axios";
import Auth from "./features/auth/Auth";
import Chat from "./features/chat/Chat";
import ChatComponent from "./components/chat/dm/ChatComponent";
import ChatWindowComponent from "./components/chat/dm/ChatWindowComponent";
import Matches from "./features/match/Match";
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

function App() {
  axios.defaults.withCredentials = true;

  return (
    <Grid container>
      <NewNavBar />
      <Grid item xs>
        <Routes>
          <Route path="/login" element={<Auth/>} />
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
          <Route path="/match" element={<Matches />} />
          <Route path="/game" element={
            <PrivateRouter>
              <GameMatching />
            </PrivateRouter>
          } />
            <Route path="player1" element={<GamePlayer1/>} />
            <Route path="player2" element={<GamePlayer2/>} />
            <Route path="observer" element={<GameObserver/>} />
            <Route path="select_room" element={<GameSelectRoom/>} />
            <Route path="game_room" element={<CreateGameRoom/>} />
            <Route path="invite_room" element={<InviteRoom/>} />
            <Route path="join_invited_room" element={<JoinInvitedRoom></JoinInvitedRoom>} />
          <Route />
        </Routes>
      </Grid>
    </Grid>
  )
}
export default App;
