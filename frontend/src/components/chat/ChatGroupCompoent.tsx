import { Grid, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React from "react";
import ChatFriendsComponent from "./ChatFriendsComponent";


/**
 * @returns chatの会話中のフレンド、グループを表示するコンポーネント
 */
export default function ChatGroupComponent() {
  return (
    <Grid item xs={3} height={"94vh"}>
      <Box>
        <Stack>
          <Box sx={{ backgroundColor: '#141E61'}}>
            <Typography
              variant="h6"
              borderTop={2.5} borderBottom={2.5} borderRight={2.5} borderColor={'#787A91'}
              sx={{ fontFamily: 'Lato', color: '#e1e2e2' }}
            >
              Direct Messages
            </Typography>
          </Box>
          <Box>
            <ChatFriendsComponent/>
          </Box>
        </Stack>
      </Box>
    </Grid>
  )
}
