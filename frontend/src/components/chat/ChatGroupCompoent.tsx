import { Grid, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import ChatFriendsComponent from "./ChatFriendsComponent";


/**
 * @returns chatの会話中のフレンド、グループを表示するコンポーネント
 */
export default function ChatGroupComponent() {
  const subtitleElm = useRef<HTMLInputElement>();
  const [subtitleHeight, setSubtitleHeight] = useState<string>('0');


  useEffect(() => {
    if (subtitleElm.current) {
      setSubtitleHeight(`${subtitleElm.current.clientHeight.toString()}px`);
    }
  }, [subtitleElm, subtitleHeight]);

  return (
    <Grid item xs={3} height={'94vh'}>
      <Box>
        <Stack>
          <Box sx={{ backgroundColor: '#141E61'}} ref={subtitleElm}>
            <Typography
              variant="h6"
              borderTop={1} borderBottom={2.5} borderRight={2.5} borderColor={'#787A91'}
              padding={0.5}
              sx={{ fontFamily: 'Lato', color: '#e1e2e2', fontWeight: 700 }}
            >
              Direct Messages
            </Typography>
          </Box>
          <Stack
            height={`calc(94vh - ${subtitleHeight})`}
            sx={{ backgroundColor: '#141E61', overflow: 'scroll' }} borderRight={2.5} borderColor={'#787A91'}
          >
            <ChatFriendsComponent/>
          </Stack>
        </Stack>
      </Box>
    </Grid>
  )
}
