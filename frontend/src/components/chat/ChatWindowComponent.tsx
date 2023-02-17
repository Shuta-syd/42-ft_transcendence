import { Grid , Typography, TextField, InputAdornment, IconButton} from "@mui/material";
import { Box, Stack } from "@mui/system";
import SendIcon from '@mui/icons-material/Send';
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { WebsocketContext } from "../../contexts/WebsocketContext";
import useQueryChat from "../../hooks/chat/useQueryChat";
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
  const { data } = useQueryChat(1);
  const { createMessageMutation } = useMutationMessage(1);
  const [text, setText] = useState('');
  const [chatLog, setChatLog] = useState<ChatLog>([]);
  const socket: Socket = useContext(WebsocketContext);

  useEffect(() => {
    socket.on('connect', () => {
      console.log(`接続ID: ${socket.id}`);
    });

    socket.on('chatToClient', (chat: MessagePayload) => {
      const newChatLog = [...chatLog, chat];
      setChatLog(newChatLog);
    });

    return () => {
      console.log(`切断: ${socket.id}`);
      socket.disconnect();
    }
  }, [])

  useEffect(() => {
    data?.map((obj) => {
      const chat: MessagePayload = { time: obj.createdAt.toString(), text: obj.message };
      setChatLog(prevChatLog => [...prevChatLog, chat]);
    })
  }, [])

  const getNow  = useCallback((): string => {
    const date = new Date();
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}
     ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
    `
  }, []);

  const sendChat = useCallback(() => {
    console.log('Message Emit');
    socket.emit('chatToServer', { text, time: getNow() })
    createMessageMutation.mutate({
      message: text,
      roomId: 1,
      userId: 1,
    })
    setText('');
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
