/* eslint-disable no-unused-vars */
import { Box, Grid, Typography } from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import useMutationMessage from "../../hooks/chat/useMutationMessage";
import getUserName from "../../utils/getUserName";
import TextFieldComponent from "../utils/TextFieldComponent";
import ChatlogComponent from "./ChatlogComponent";

type MessagePayload = {
  time: string;
  senderName: string;
  text: string;
};

type ChatLog = MessagePayload[];

export default function NewChannelWindowComponent() {
  const socket: Socket = useOutletContext();
  const { roomId } = useParams();
  const ChatRoomID: string = roomId as string;
  const { createMessageMutation } = useMutationMessage(socket, ChatRoomID);
  const [text, setText] = useState('');
  const [userName, setUserName] = useState('');
  const [roomName, setRoomName] = useState('');

  const getRoomName = useCallback(async (): Promise<string> => {
    try {
      const res = await axios.get(`http://localhost:8080/chat/room/${ChatRoomID}`);
      return res.data.name;
    } catch (error) {
      console.log(error);
    }
    return '';
  }, [ChatRoomID])

  useEffect(() => {
    getUserName().then((name) => { setUserName(name); });
    getRoomName().then((name) => { setRoomName(name); })
  }, [ChatRoomID])


  const sendChat = () => {
    if (text === '')
      return;
    createMessageMutation.mutate({
      message: text,
      senderName: userName,
    });
    setText('');
  };

  return (
    <Grid
      item xs
      width={'100%'}
      borderRadius={5}
      sx={{ backgroundColor: '#edf0f5' }}
    >
      <Grid container justifyContent={'center'}>
        <Box
          width={'95%'}
          height={'7vh'}
          borderBottom={2}
          borderColor={'#e0e3e9'}
          textAlign={'left'}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Typography
            variant="h6"
            mt={1} ml={2}
            sx={{ color: '#3C444B' }}
          >
            @{roomName}
          </Typography>
        </Box>
      </Grid>
      <Box>
        <ChatlogComponent roomId={ChatRoomID} socket={socket} />
      </Box>
      <Box
        height={'92%'}
        display='flex'
        justifyContent='center'
      >
        <Box
          width={'95%'}
          position='relative'
        >
          <TextFieldComponent
            value={text}
            handleOnChange={setText}
            handleOnClick={sendChat}
          />
        </Box>
      </Box>
    </Grid>
  )
}
