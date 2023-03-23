import { Box, Grid, Typography } from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import useMutationMessage from "../../../hooks/chat/useMutationMessage";
import TextFieldComponent from "../../utils/TextFieldComponent";
import ChatlogComponent from "../utils/ChatlogComponent";

type ChannelDisplayComponentProps = {
  socket: Socket;
  roomId: string;
  userName: string;
}

export default function ChatDisplayComponent(props: ChannelDisplayComponentProps) {
  const { roomId, socket, userName } = props;
  const [myMemberId, setMyMemberId] = useState<string>('');
  const [roomName, setRoomName] = useState('');
  const { createMessageMutation } = useMutationMessage(socket, roomId, true);
  const [text, setText] = useState('');
  const textfieldElm = useRef<HTMLInputElement>(null);
  const router = useNavigate();

  const getFriendNameFromRoomName = (user: string, room: string): string => {
    let friendName: string = '';

    const names = room.split(',');
    names.map((name) => {
      if (name !== user)
        friendName = name;
    })
    return friendName;
  }

  const getRoomName = useCallback(async (): Promise<string> => {
    try {
      const res = await axios.get(`http://localhost:8080/chat/room/${roomId}`);
      console.log(res.data);
      return res.data.name;
    } catch (error) {
      alert('チャットルームが見つかりませんでした');
      router('/chat/room');
    }
    return '';
  }, [roomId])

  useEffect(() => {
    const getMymember = async () => {
      const { data: myMember } = await axios.get(`http://localhost:8080/chat/${roomId}/myMember`);
      setMyMemberId(myMember.id);
    }

    getMymember();
    getRoomName().then((name) => { setRoomName(name); })
  }, [roomId])


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
      item xs={7}
      width={'100%'}
      height={'100%'}
      position='relative'
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
            @{getFriendNameFromRoomName(userName, roomName)}
          </Typography>
        </Box>
      </Grid>
      <Box
        sx={{ display: 'flex', justifyContent: 'center' }}
        height={`calc(85% - ${textfieldElm?.current?.clientHeight}px)`}
      >
        <ChatlogComponent roomId={roomId} socket={socket} memberId={myMemberId} />
        </Box>
      <Box
        display='flex'
        justifyContent='center'
        >
        <Box
          width={'95%'}
          position='absolute'
          bottom={20}
          ref={textfieldElm}
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
