import { Grid , Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { createRef, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import axios from "axios";
import { Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import { WebsocketContext } from "../../contexts/WebsocketContext";
import useQueryChatLog from "../../hooks/chat/useQueryChatLog";
import useMutationMessage from "../../hooks/chat/useMutationMessage";
import TextFieldComponent from "../utils/TextFieldComponent";

type MessagePayload = {
  time: string;
  senderName: string;
  text: string;
};


type ChatLog = MessagePayload[];
/**
 * @returns 実際にchatをするトーク画面のコンポーネント
 */
export default function ChatWindowComponent() {
  const socket: Socket = useContext(WebsocketContext);
  const { roomId } = useParams();
  const ChatRoomID: string = roomId as string;
  const { data } = useQueryChatLog(ChatRoomID);
  const { createMessageMutation } = useMutationMessage(ChatRoomID);
  const [friendName, setFriendName] = useState('');
  const [userName, setUserName] = useState('');
  const [text, setText] = useState('');
  const [chatLog, setChatLog] = useState<ChatLog>([]);
  const [subtitleHeight, setSubtitleHeight] = useState<string>('0');
  const subtitleElm = useRef<HTMLInputElement>(null);
  const latestChatRef = createRef<HTMLDivElement>();

  const getUserName = useCallback(async (): Promise<string> => {
    const res = await axios.get(`http://localhost:8080/user`);
    return res.data.name;
  }, [ChatRoomID]);

  const getFriendName = useCallback(async (): Promise<string> => {
    const res = await axios.get(`http://localhost:8080/chat/room/${ChatRoomID}/dm/friend`);
    return res.data;
  }, [ChatRoomID]);

  const getMemberId = useCallback(async (): Promise<string> => {
    const res = await axios.get(`http://localhost:8080/chat/room/${ChatRoomID}/memberId`)
    return res.data;
  }, [ChatRoomID]);

  useEffect(() => {
    socket.on('chatToClient', (chat: MessagePayload) => {
      setChatLog(prevChatLog => [...prevChatLog, chat]);
    });
  }, [])

  useEffect(() => {
    getFriendName().then((name) => { setFriendName(name); })
    getUserName().then((name) => { setUserName(name); })
  }, [ChatRoomID])

  useEffect(() => {
    if (subtitleElm.current) {
      setSubtitleHeight(`${subtitleElm.current.clientHeight.toString()}px`);
    }
  }, [subtitleElm, subtitleHeight])


  useEffect(() => {
    setChatLog([]);
    if (data) {
      data?.map((obj) => {
        const chat: MessagePayload = { senderName: obj.senderName, time: convertDate(obj.createdAt), text: obj.message };
        setChatLog(prevChatLog => [...prevChatLog, chat]);
      })
    }
  }, [data])

  useLayoutEffect(() => {
    latestChatRef.current?.scrollIntoView();
  }, [chatLog])

  const convertDate = (str: Date): string => {
    const date = new Date(str);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}
    ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }

  const getNow  = useCallback((): string => {
    const date = new Date();
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}
     ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
    `
  }, []);

  const sendChat = useCallback(() => {
    if (text === '')
      return;
    getMemberId().then((id) => {
      console.log('Message Emit');
      socket.emit('send_message_room', { senderName: userName , text, time: getNow(), id: roomId })
      createMessageMutation.mutate({
        message: text,
        senderName: userName,
        memberId: id,
      });
      setText('');
    })
  }, [text]);

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
            @ {friendName}
          </Typography>
        </Box>
        <Box
          maxHeight={`calc(94vh - ${subtitleHeight})`}
        >
          <Box sx={{color: '#EEEEEE', backgroundColor: '#0F044C', overflow: 'scroll'}} height={`calc(85vh - ${subtitleHeight})`}>
            {chatLog.map((chat, idx) => (
              <div key={idx}>
                <div>{chat.time}</div>
                <div>{chat.senderName}: {chat.text}</div>
              </div>
            ))}
            <div ref={latestChatRef} />
          </Box>
          <Box height={'9vh'} sx={{ backgroundColor: '#0F044C' }}>
            <TextFieldComponent handleOnChange={setText} handleOnClick={sendChat} value={text}/>
          </Box>
        </Box>
      </Stack>
    </Grid>
  )
}
