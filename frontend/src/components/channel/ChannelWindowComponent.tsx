/* eslint-disable no-unused-vars */
import { Grid , Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { createRef, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import axios from "axios";
import { Socket } from "socket.io-client";
import { useOutletContext, useParams } from "react-router-dom";
import useMutationMessage from "../../hooks/chat/useMutationMessage";
import TextFieldComponent from "../utils/TextFieldComponent";
import { Message } from "../../types/PrismaType";
import getUserName from "../../utils/getUserName";
import getMemberId from "../../utils/getMemberId";
import getNow from "../../utils/getNow";
import convertDate from "../../utils/convertDate";
import MoreOptionButton from "../utils/MoreOptionButton";
import UserParticipant from "./UserParticipants";

type MessagePayload = {
  time: string;
  senderName: string;
  text: string;
};


type ChatLog = MessagePayload[];

/**
 * @returns 実際にchatをするトーク画面のコンポーネント (Channel用P)
 */
export default function ChannelWindowComponent() {
  const socket: Socket = useOutletContext();
  const { roomId } = useParams();
  const ChatRoomID: string = roomId as string;
  const { createMessageMutation } = useMutationMessage(ChatRoomID);
  const [subtitleHeight, setSubtitleHeight] = useState<string>('0px');
  const subtitleElm = useRef<HTMLInputElement>(null);
  const [GridWidth, setGridWidth] = useState<string>('100%');
  const [text, setText] = useState('');
  const [userName, setUserName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [chatLog, setChatLog] = useState<ChatLog>([]);
  const latestChatRef = createRef<HTMLDivElement>();

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
    socket.on('chatToClient', (chat: MessagePayload) => {
      setChatLog(prevChatLog => [...prevChatLog, chat]);
    });
  }, [])

  useEffect(() => {
    if (subtitleElm.current) {
      setSubtitleHeight(`${(subtitleElm.current.clientHeight + 3.5).toString()}px`);
    }
  }, [subtitleElm, subtitleHeight, isOpen])

  useEffect(() => {
    getUserName().then((name) => { setUserName(name); });
    getRoomName().then((name) => { setRoomName(name); })
  }, [ChatRoomID])

  useLayoutEffect(() => {
    const fetchChat = async () => {
      setChatLog([]);
      const { data } = await axios.get<Message[]>(`http://localhost:8080/chat/room/log/${ChatRoomID}`);
      if (data) {
        data?.map((obj) => {
          const chat: MessagePayload = { senderName: obj.senderName, time: convertDate(obj.createdAt), text: obj.message };
          setChatLog(prevChatLog => [...prevChatLog, chat]);
        })
      }
    }

    fetchChat();
  }, [ChatRoomID])

  useLayoutEffect(() => {
    latestChatRef.current?.scrollIntoView();
  }, [chatLog])

  const sendChat = () => {
    if (text === '')
      return;
    getMemberId(ChatRoomID).then((id) => {
      console.log('Message Emit');
      socket.emit('send_message_room', { senderName: userName , text, time: getNow(), id: roomId })
      createMessageMutation.mutate({
        message: text,
        senderName: userName,
        memberId: id,
      });
      setText('');
    })
  };

  return (
    <Grid item xs={9} position='relative'>
      <Stack spacing={0}>
        <Box
          width={GridWidth}
          borderTop={1} borderBottom={2.5} borderColor={'#787A91'}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: '#141E61'
          }}
          ref={subtitleElm}
        >
          <Typography
            variant="h6"
            padding={0.5}
            sx={{ fontFamily: 'Lato', color: '#e1e2e2', fontWeight:700 }}
            >
            @ {roomName}
          </Typography>
          <Box
            sx={{
            marginRight: '1.5vw'
            }}
          >
            <MoreOptionButton isOpen={isOpen} setIsOpen={setIsOpen} DrawerElement={<UserParticipant />} setGridWidth={setGridWidth} />
          </Box>
        </Box>
        <Box
          maxHeight={`calc(94vh - ${subtitleHeight}px)`}
        >
          <Box
            sx={{ color: '#EEEEEE', backgroundColor: '#0F044C', overflow: 'auto' ,overflowWrap: 'break-word', wordWrap: 'break-word' }}
            maxWidth={GridWidth} height={`calc(85vh - ${subtitleHeight})`}
          >
          {chatLog.map((chat, idx) => (
              <div key={idx}>
                <div>{chat.time}</div>
                <div>{chat.senderName}: {chat.text}</div>
              </div>
            ))}
            <div ref={latestChatRef} />
          </Box>
          <Box height={'9vh'} sx={{ backgroundColor: '#0F044C' }}>
            <TextFieldComponent textFieldWidth={GridWidth} handleOnChange={setText} handleOnClick={sendChat} value={text} />
          </Box>
        </Box>
      </Stack>
    </Grid>
  )
}
