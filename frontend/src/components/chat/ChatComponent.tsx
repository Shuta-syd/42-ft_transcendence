import { Grid } from "@mui/material";
import React from "react";
import ChatGroupComponent from "./ChatGroupCompoent";
import ChatWindowComponent from "./ChatWindowComponent";

/**
 * @returns chat画面のコンポーネント
 */
export default function ChatComponent() {
  return (
    <Grid container >
      <ChatGroupComponent />
      <ChatWindowComponent />
    </Grid>
  )
}
