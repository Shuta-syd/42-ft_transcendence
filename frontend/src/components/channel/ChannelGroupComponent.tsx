import { Grid, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { ChatRoom } from "../../types/PrismaType";
import ChannelMoreOption from "./ChannelMoreOption";
import ChannelListComponent from "./ChannelListComponent";

type ChannelGroupComponentProps = {
  socket: Socket;
}

/**
 * @returns 所属中のChannelリストを表示するコンポーネント
 */
export default function ChannelGroupComponent(props: ChannelGroupComponentProps) {
  const subtitleElm = useRef<HTMLInputElement>();
  const [subtitleHeight, setSubtitleHeight] = useState<string>('0');
  const [channels, setChannels] = useState<ChatRoom[]>([]);


  useEffect(() => {
    if (subtitleElm.current) {
      setSubtitleHeight(`${(subtitleElm.current.clientHeight + 3.5).toString()}px`);
    }
  }, [subtitleElm, subtitleHeight]);

  return (
    <Grid item xs={3} height={'100vh'}>
      <Box>
        <Stack>
          <Box
          ref={subtitleElm}
            borderTop={1} borderBottom={2.5} borderRight={1} borderColor={'#787A91'}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              backgroundColor: '#141E61'
            }}
          >
            <Box sx={{ backgroundColor: '#141E61'}}>
              <Typography
                variant="h6"
                padding={0.5}
                sx={{ fontFamily: 'Lato', color: '#e1e2e2', fontWeight: 700 }}
              >
                Channels
              </Typography>
            </Box>
            <Box
              sx={{
                marginRight: '0.5vw'
              }}
            >
              <ChannelMoreOption  setChannels={setChannels} />
            </Box>
          </Box>
          <Stack
            height={`calc(100vh - ${subtitleHeight})`}
            sx={{ backgroundColor: '#141E61', overflow: 'auto' }} borderColor={'#787A91'}
          >
            <ChannelListComponent socket={props.socket} channels={channels} setChannels={setChannels} />
          </Stack>
        </Stack>
      </Box>
    </Grid>
  )
}
