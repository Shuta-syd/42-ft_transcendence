import { Box, Grid, Typography } from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import useMutationMessage from "../../../hooks/chat/useMutationMessage";
import TextFieldComponent from "../../utils/TextFieldComponent";
import ChatlogComponent from "../utils/ChatlogComponent";
import { getFriendNameFromRoomName, getUserId } from "../../../utils/chat/ChatAxios";

type ChannelDisplayComponentProps = {
  socket: Socket;
  roomId: string;
  userName: string;
}

export default function ChatDisplayComponent(props: ChannelDisplayComponentProps) {
  const { roomId, socket, userName } = props;
  const [myUserId, setMyUserId] = useState<string>('');
  const [roomName, setRoomName] = useState('');
  const [memberImages, setMemberImages] = useState<Map<string, string>>(new Map());
  const { createMessageMutation } = useMutationMessage(socket, roomId, true);
  const [text, setText] = useState('');
  const textfieldElm = useRef<HTMLInputElement>(null);
  const router = useNavigate();

  const getRoom = useCallback(async (): Promise<string> => {
    try {
      const res = await axios.get(`http://localhost:8080/chat/room/${roomId}`);
      return res.data;
    } catch (error) {
      alert('チャットルームが見つかりませんでした');
      router('/chat/room');
    }
    return '';
  }, [roomId])

  useEffect(() => {
    getUserId().then((id: string) => setMyUserId(id));
    getRoom().then((room: any) => {
      setRoomName(room.name);
      const memberImage: Map<string, string> = new Map();
      room.members.map((member: any) => {
        memberImage.set(member.user.id, member.user.image);
      })
      if (memberImage)
        setMemberImages(memberImage);
    })
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
            @{getFriendNameFromRoomName(roomName, userName)}
          </Typography>
        </Box>
      </Grid>
      <Box
        sx={{ display: 'flex', justifyContent: 'center' }}
        height={`calc(85% - ${textfieldElm?.current?.clientHeight}px)`}
      >
        <ChatlogComponent roomId={roomId} socket={socket} userId={myUserId} memberImage={memberImages} />
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
