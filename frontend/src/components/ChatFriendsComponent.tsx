import { Avatar, Grid, Link, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import PersonIcon from '@mui/icons-material/Person';
import React from "react";

/**
 * @returns DirectMessage送信可能なフレンド一覧を表示するコンポーネント
 */
export default function ChatFriendsComponent() {
  const friends = SampleFriend;
  return (
    <Stack>
      {friends.map((friend, idx) => (
        <Grid container spacing={2} key={idx}>
          <Grid item>
            <Avatar ><PersonIcon /></Avatar>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1">{friend}</Typography>
          </Grid>
        </Grid>
      ))}
    </Stack>
  )
}


const SampleFriend: string[] = ['user1', 'user2', 'user3'];
