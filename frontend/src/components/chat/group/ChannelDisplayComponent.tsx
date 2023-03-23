import { Box, Grid, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import useMutationMessage from "../../../hooks/chat/useMutationMessage";
import { ChatRoom } from "../../../types/PrismaType";
import getUserName from "../../../utils/getUserName";
import TextFieldComponent from "../../utils/TextFieldComponent";
import ChatlogComponent from "../utils/ChatlogComponent";
import ChannelEditDialog from "./ChannelEditDialog";

type ChannelDisplayComponentProps = {
  socket: Socket;
  roomId: string;
  setChannels: any;
  channels: any;
}

export default function ChannelDisplayComponent(props: ChannelDisplayComponentProps) {
  const { roomId, socket, setChannels, channels } = props;
  const [myUserId, setMyUserId] = useState<string>('');
  const [userName, setUserName] = useState('');
  const [myRole, setMyRole] = useState<string>('');
  const [roomName, setRoomName] = useState('');
  const { createMessageMutation } = useMutationMessage(socket, roomId, false);
  const [text, setText] = useState('');
  const textfieldElm = useRef<HTMLInputElement>(null);

  useEffect(() => {
    channels.map((room: ChatRoom) => {
      if (room.id === roomId) {
        setRoomName(room.name); // すでルームに入っている時にリロードするとsetされないからuseLocation使うのがいいかも
      }
    })
  }, [channels, roomId])


  useEffect(() => {
    const getUserId = async () => {
      const { data: myUser } = await axios.get(`http://localhost:8080/user`);
      setMyUserId(myUser.id);
    }

    const getMyRole = async () => {
      const { data: member } = await axios.get(`http://localhost:8080/chat/${roomId}/myMember`);
      setMyRole(member.role);
    }

    getUserId();
    getMyRole();
    getUserName().then((name) => { setUserName(name); });
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
          <Grid container justifyContent={'space-between'}>
            <Grid item>
              <Typography
                variant="h6"
                mt={1} ml={2}
                sx={{ color: '#3C444B' }}
              >
                @{roomName}
              </Typography>
            </Grid>
            <Grid item>
              {myRole === 'OWNER' ? (
                <>
                  <ChannelEditDialog roomId={roomId} setChannels={setChannels} channels={channels} />
                </>
              ) : (<></>)}
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Box
        sx={{ display: 'flex', justifyContent: 'center' }}
        height={`calc(85% - ${textfieldElm?.current?.clientHeight}px)`}
      >
        <ChatlogComponent roomId={roomId} socket={socket} userId={myUserId} />
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
