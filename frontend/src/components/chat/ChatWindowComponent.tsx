import { Grid, Paper, Typography, Button, TextField, InputAdornment } from "@mui/material";
import { Box, Stack } from "@mui/system";
import SendIcon from '@mui/icons-material/Send';
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
        <TextField
          fullWidth label="new message" variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <SendIcon/>
              </InputAdornment>
            )
          }}
        />
      </Stack>
    </Grid>
  )
}
