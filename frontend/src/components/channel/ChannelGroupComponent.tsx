import { Grid, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import CustomPlusButton from "../utils/CustomPlusButton";
import ChannelListComponent from "./ChannleListComponent";

type ChannelGroupComponentProps = {
  socket: Socket;
}


/**
 * @returns 所属中のChannelリストを表示するコンポーネント
 */
export default function ChannelGroupComponent(props: ChannelGroupComponentProps) {
  const subtitleElm = useRef<HTMLInputElement>();
  const [subtitleHeight, setSubtitleHeight] = useState<string>('0');


  useEffect(() => {
    if (subtitleElm.current) {
      setSubtitleHeight(`${(subtitleElm.current.clientHeight + 3.5).toString()}px`);
    }
  }, [subtitleElm, subtitleHeight]);

  return (
    <Grid item xs={3} height={'94vh'}>
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
              <CustomPlusButton />
            </Box>
          </Box>
          <Stack
            height={`calc(94vh - ${subtitleHeight})`}
            sx={{ backgroundColor: '#141E61', overflow: 'auto' }} borderColor={'#787A91'}
          >
            <ChannelListComponent socket={props.socket} />
          </Stack>
        </Stack>
      </Box>
    </Grid>
  )
}
