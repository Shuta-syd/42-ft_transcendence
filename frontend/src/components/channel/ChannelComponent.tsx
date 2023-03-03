import { Grid } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import ChannelGroupComponent from "./ChannelGroupComponent";


/**
 * @returns Channel画面のコンポーネント
 */
export default function ChannelComponent() {
  return (
    <>
      <Grid container>
        <ChannelGroupComponent />
        <Outlet />
      </Grid>
    </>
  )
}
