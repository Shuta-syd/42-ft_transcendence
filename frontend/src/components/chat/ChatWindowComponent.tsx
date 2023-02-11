import { Grid, Paper, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React from "react";

/**
 * @returns 実際にchatをするトーク画面のコンポーネント
 */
export default function ChatWindowComponent() {
  return (
    <Grid item xs={9}>
      <Stack spacing={0}>
        <Box sx={{backgroundColor: '#b39ddb'}}>
          <Typography variant="h6">Chat Window</Typography>
        </Box>
        <Paper elevation={1} sx={{backgroundColor: '#ede7f6'}}>
          <h1>hello</h1>
        </Paper>
      </Stack>
    </Grid>
  )
}
