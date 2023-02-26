import { Grid , Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import { WebsocketContext } from "../../contexts/WebsocketContext";
import useQueryChatLog from "../../hooks/chat/useQueryChatLog";
import useMutationMessage from "../../hooks/chat/useMutationMessage";
import TextFieldComponent from "../utils/TextFieldComponent";

type MessagePayload = {
  time: string;
  text: string;
};


type ChatLog = MessagePayload[];
/**
 * @returns 実際にchatをするトーク画面のコンポーネント
 */
export default function ChatWindowComponent() {
  const UserID = 'ba822ee0-7a6e-43a8-98cc-eb93f7433bb5'; // tmp
  const { roomId } = useParams();
  const ChatRoomID: string = roomId as string;
  const { data } = useQueryChatLog(ChatRoomID);
  const { createMessageMutation } = useMutationMessage(ChatRoomID);
  const [friendName, setFriendName] = useState('');
  const [text, setText] = useState('');
  const [chatLog, setChatLog] = useState<ChatLog>([]);
  const socket: Socket = useContext(WebsocketContext);

  useEffect(() => {
    socket.on('chatToClient', (chat: MessagePayload) => {
      setChatLog(prevChatLog => [...prevChatLog, chat]);
    });
  }, [])

  useEffect(() => {
    getFriendName().then((name) => { setFriendName(name); })
  }, [ChatRoomID])


  const getFriendName = useCallback(async (): Promise<string> => {
    const res = await axios.get(`http://localhost:8080/chat/room/${ChatRoomID}`);
    const member = res.data.members.filter((val: any) => val.userId !== UserID);
    return member[0].user.name;
  }, [ChatRoomID]);

  const getMemberId = useCallback(async (): Promise<string> => {
    const res = await axios.get(`http://localhost:8080/chat/room/${ChatRoomID}`);
    const member = res.data.members.filter((val: any) => val.userId === UserID);
    return member[0].id;
  }, [ChatRoomID]);


  useEffect(() => {
    setChatLog([]);
    if (data) {
      data?.map((obj) => {
        const chat: MessagePayload = { time: obj.createdAt.toString(), text: obj.message };
        setChatLog(prevChatLog => [...prevChatLog, chat]);
      })
    }
  }, [data])

  const getNow  = useCallback((): string => {
    const date = new Date();
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}
     ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
    `
  }, []);

  const sendChat = useCallback(() => {
    getMemberId().then((id) => {
      console.log('Message Emit');
      socket.emit('send_message_room', { text, time: getNow(), id: roomId })
      createMessageMutation.mutate({
        message: text,
        memberId: id,
      });
      setText('');
    })
  }, [text]);

  return (
    <Grid item xs={9} height={"94vh"} position='relative'>
      <Stack spacing={0}>
        <Box sx={{backgroundColor: '#141E61'}}>
          <Typography
              variant="h6"
              borderRight={2.5} borderTop={2.5} borderBottom={2.5} borderColor={'#787A91'}
              sx={{ fontFamily: 'Lato', color: '#e1e2e2', fontWeight:700 }}
            >
            @ {friendName}
          </Typography>
        </Box>
        <Box sx={{ backgroundColor: '#0F044C', height: '91vh' }}>
          <Box sx={{color: '#EEEEEE'}}>
            {chatLog.map((chat, idx) => (
              <div key={idx}>
                <div>{chat.time}</div>
                <div>user: {chat.text}</div>
              </div>
            ))}
          </Box>
          <TextFieldComponent handleOnChange={setText} handleOnClick={sendChat} value={text} />
        </Box>
      </Stack>
    </Grid>
  )
}
