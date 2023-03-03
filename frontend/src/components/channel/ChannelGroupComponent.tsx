import { Grid, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import ChannelListComponent from "./ChannleListComponent";


/**
 * @returns 所属中のChannelリストを表示するコンポーネント
 */
export default function ChannelGroupComponent() {
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
              Channels
            </Typography>
          </Box>
          <Stack
            height={`calc(94vh - ${subtitleHeight})`}
            sx={{ backgroundColor: '#141E61', overflow: 'auto' }} borderColor={'#787A91'}
          >
            <ChannelListComponent />
          </Stack>
        </Stack>
      </Box>
    </Grid>
  )
}
