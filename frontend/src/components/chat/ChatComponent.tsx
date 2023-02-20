import { Grid } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import ChatGroupComponent from "./ChatGroupCompoent";

/**
 * @returns chat画面のコンポーネント
 */
export default function ChatComponent() {
  return (
    <Grid container>
      <ChatGroupComponent />
      <Outlet/>
    </Grid>
  )
}
