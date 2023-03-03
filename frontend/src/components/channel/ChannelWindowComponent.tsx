/* eslint-disable no-unused-vars */
import { Grid , Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { createRef, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import axios from "axios";
import { Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import { WebsocketContext } from "../../contexts/WebsocketContext";
import useMutationMessage from "../../hooks/chat/useMutationMessage";
import TextFieldComponent from "../utils/TextFieldComponent";
import { Message } from "../../types/PrismaType";

type MessagePayload = {
  time: string;
  senderName: string;
  text: string;
};


type ChatLog = MessagePayload[];

const convertDate = (str: Date): string => {
  const date = new Date(str);
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}
  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

/**
 * @returns 実際にchatをするトーク画面のコンポーネント
 */
export default function ChannelWindowComponent() {
  const [subtitleHeight, setSubtitleHeight] = useState<string>('0');
  const subtitleElm = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (subtitleElm.current) {
      setSubtitleHeight(`${subtitleElm.current.clientHeight.toString()}px`);
    }
  }, [subtitleElm, subtitleHeight])


  return (
    <Grid item xs={9} position='relative'>
      <Stack spacing={0}>
        <Box sx={{backgroundColor: '#141E61'}} ref={subtitleElm}>
          <Typography
            variant="h6"
            borderTop={1} borderBottom={2.5} borderColor={'#787A91'}
            padding={0.5}
            sx={{ fontFamily: 'Lato', color: '#e1e2e2', fontWeight:700 }}
            >
            @ TEST
          </Typography>
        </Box>
        <Box
          maxHeight={`calc(94vh - ${subtitleHeight})`}
        >
          <Box sx={{color: '#EEEEEE', backgroundColor: '#0F044C', overflow: 'auto'}} height={`calc(85vh - ${subtitleHeight})`}>
          </Box>
          <Box height={'9vh'} sx={{ backgroundColor: '#0F044C' }}>
            {/* <TextFieldComponent handleOnChange={setText} handleOnClick={sendChat} value={text}/> */}
          </Box>
        </Box>
      </Stack>
    </Grid>
  )
}
