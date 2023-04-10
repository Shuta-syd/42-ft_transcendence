import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import useMutationMessage from "../../../hooks/chat/useMutationMessage";
import { ChatRoom } from "../../../types/PrismaType";
import getUserName from "../../../utils/getUserName";
import TextFieldComponent from "../../utils/TextFieldComponent";
import ChatlogComponent from "../utils/ChatlogComponent";
import ChannelEditDialog from "./ChannelEditDialog";
import { getMyRole, getUserId } from "../../../utils/chat/ChatAxios";

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
  const [text, setText] = useState('');
  const [roomName, setRoomName] = useState('');
  const [images, setImages] = useState<Map<string, string>>(new Map());
  const { createMessageMutation } = useMutationMessage(socket, roomId, false);
  const textfieldElm = useRef<HTMLInputElement>(null);

  useEffect(() => {
    socket.on('updateChannelInfo', (dto: { id: string, name: string }) => {
      const tmpChannels = [...channels];
      const idx = tmpChannels.findIndex((channel: any) => channel.id === dto.id);
      if (idx !== -1) {
        tmpChannels[idx] = {
          ...tmpChannels[idx],
          name: dto.name,
        };
      }
      setChannels(tmpChannels);
      })
  }, [socket]);

  useEffect(() => {
    channels.map((room: ChatRoom) => {
      if (room.id === roomId) {
        setRoomName(room.name);
        const memberImage: Map<string, string> = new Map();
        room.members?.map((member: any) => {
          memberImage.set(member.userId, member.user.image);
        })
        if (memberImage)
        setImages(memberImage);
      }
    })
  }, [channels, roomId])


  useEffect(() => {
    getUserId().then((id: string) => setMyUserId(id));
    getMyRole(roomId).then((role: string) => { setMyRole(role)})
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
                  <ChannelEditDialog roomId={roomId} channels={channels} socket={socket} />
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
        <ChatlogComponent roomId={roomId} socket={socket} userId={myUserId} memberImage={images} />
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
