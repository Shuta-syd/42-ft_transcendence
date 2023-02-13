import { Grid, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React from "react";
import ChatFriendsComponent from "./ChatFriendsComponent";


/**
 * @returns chatの会話中のフレンド、グループを表示するコンポーネント
 */
export default function ChatGroupComponent() {
  return (
    <Grid item xs={3} height={"93vh"}>
      <Box>
        <Stack>
          <Box sx={{ backgroundColor: '#b39ddb'}}>
            <Typography variant="h6">Direct Messages</Typography>
          </Box>
          <Box>
            <ChatFriendsComponent />
          </Box>
        </Stack>
      </Box>
    </Grid>
  )
}
