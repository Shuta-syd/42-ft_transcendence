import { Grid, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React from "react";

/**
 * @returns 実際にchatをするトーク画面のコンポーネント
 */
export default function ChatWindowComponent() {
  return (
    <Grid item xs={9}>
      <Box sx={{ border: 1, borderRadius: 1 }}>
        <Stack spacing={0}>
          <Typography variant="h6">Chat Window</Typography>
        </Stack>
      </Box>
    </Grid>
  )
}
