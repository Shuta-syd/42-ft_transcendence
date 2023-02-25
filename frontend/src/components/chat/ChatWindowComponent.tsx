import { Grid , Typography, TextField, InputAdornment, IconButton} from "@mui/material";
import { Box, Stack } from "@mui/system";
import SendIcon from '@mui/icons-material/Send';
import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import { WebsocketContext } from "../../contexts/WebsocketContext";
import useQueryChatLog from "../../hooks/chat/useQueryChatLog";
import useMutationMessage from "../../hooks/chat/useMutationMessage";

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
  // eslint-disable-next-line no-unused-vars
  let iAm: {key: string};
  const { roomId } = useParams();
  const ChatRoomID: string = roomId as string;
  const { data } = useQueryChatLog(ChatRoomID);
  const { createMessageMutation } = useMutationMessage(ChatRoomID);
  const [text, setText] = useState('');
  const [chatLog, setChatLog] = useState<ChatLog>([]);
  const socket: Socket = useContext(WebsocketContext);

  useEffect(() => {
    socket.on('connect', () => {
      console.log(`Connect: ${socket.id}`);
    });

    socket.on('token', (token: {key: string}) => {
      iAm = token;
      console.log(token);
    })

    socket.on('chatToClient', (chat: MessagePayload) => {
      setChatLog(prevChatLog => [...prevChatLog, chat]);
    });

    return () => {
      console.log(`Disconnect: ${socket.id}`);
      socket.disconnect();
    }
  }, [])


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
      socket.emit('send_message', { text, time: getNow() })
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
        <Box sx={{backgroundColor: '#b39ddb'}}>
          <Typography variant="h6">Chat Window</Typography>
        </Box>
        <Box sx={{ backgroundColor: '#ede7f6', height: '91vh' }}>
          <Box>
            {chatLog.map((chat, idx) => (
              <div key={idx}>
                <div>{chat.time}</div>
                <div>user: {chat.text}</div>
              </div>
            ))}
          </Box>
          <TextField fullWidth variant="outlined" placeholder="new message"
            style={{position: 'absolute', bottom: 0}}
            value={text}
            onChange={(e) => { setText(e.target.value) }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton color="primary" onClick={sendChat}>
                    <SendIcon/>
                  </IconButton>
                </InputAdornment>
              )
            }}
            />
        </Box>
      </Stack>
    </Grid>
  )
}
