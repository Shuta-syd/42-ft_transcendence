import { Avatar } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";

/**
 * @returns DirectMessage送信可能なフレンド一覧を表示するコンポーネント
 */
export default function ChatFriendsComponent() {
  const friends = SampleFriend;
  return (
    <Stack>
      {friends.map((friend, idx) => (
        <>
          <Avatar>{friend}</Avatar>
        </>
      ))}
    </Stack>
  )
}


const SampleFriend: string[] = ['user1', 'user2', 'user3'];
