import { Grid, Paper, Typography, TextField, InputAdornment, IconButton} from "@mui/material";
import { Box, Stack } from "@mui/system";
import SendIcon from '@mui/icons-material/Send';
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { WebsocketContext } from "../../contexts/WebsocketContext";

type MessagePayload = {
  socketId: string;
  time: string;
  text: string;
};

type ChatLog = MessagePayload[];

/**
 * @returns 実際にchatをするトーク画面のコンポーネント
 */
export default function ChatWindowComponent() {
  const [text, setText] = useState('');
  const [chatLog, setChatLog] = useState<ChatLog>([]);
  const socket: Socket = useContext(WebsocketContext);

  useEffect(() => {
    socket.on('connect', () => {
      console.log(`接続ID: ${socket.id}`);
    });

    return () => {
      console.log(`切断: ${socket.id}`);
      socket.disconnect();
    }
  }, [])

  useEffect(() => {
    socket.on('chatToClient', (chat: MessagePayload) => {
      console.log(`チャット受信:`, chat);
      const newChatLog = [...chatLog, chat];
      setChatLog(newChatLog);
    });
  }, [chatLog])

  const getNow  = useCallback((): string => {
    const date = new Date();
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}
     ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
    `
  }, []);

  const sendChat = useCallback(() => {
    console.log('送信');
    socket.emit('chatToServer', { text, time: getNow() })
    setText('');
  }, [text]);


  return (
    <Grid item xs={9}>
      <Stack spacing={0}>
        <Box sx={{backgroundColor: '#b39ddb'}}>
          <Typography variant="h6">Chat Window</Typography>
        </Box>
        <Paper elevation={1} sx={{backgroundColor: '#ede7f6'}}>
          <h3>トーク内容（仮）</h3>
          {chatLog.map((chat, idx) => (
            <div key={idx}>
              <div>{chat.time}[{chat.socketId}]</div>
              <div>user: {chat.text}</div>
            </div>
          ))}
        </Paper>
        <TextField fullWidth variant="outlined" placeholder="new message"
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
      </Stack>
    </Grid>
  )
}
