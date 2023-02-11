import { Grid, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React from "react";
import ChatFriendsComponent from "../ChatFriendsComponent";


/**
 * @returns chatの会話中のフレンド、グループを表示するコンポーネント
 */
export default function ChatGroupComponent() {
  return (
    <Grid item xs={3}>
      <Box sx={{ border: 1, borderRadius: 1 }}>
        <Stack spacing={0}>
          <Box sx={{ border: 1, borderRadius: 1 }}>
            <Typography variant="h6">Direct Messages</Typography>
          </Box>
          <ChatFriendsComponent />
        </Stack>
      </Box>
    </Grid>
  )
}
