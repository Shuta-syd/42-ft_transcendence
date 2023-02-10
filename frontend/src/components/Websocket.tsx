import { Button, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useCallback, useContext, useEffect, useState } from "react"
import { WebsocketContext } from "../contexts/WebsocketContext"

type MessagePayload = {
  socketId: string;
  uname: string;
  time: string;
  text: string;
};

type ChatLog = MessagePayload[];

export default function Websocket() {
  const [text, setText] = useState('');
  const [uname, setUname] = useState('');
  const [chatLog, setChatLog] = useState<ChatLog>([]);
  const socket = useContext(WebsocketContext); // type is Socket

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

  const getNow = useCallback((): string => {
    const date = new Date();
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}
     ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
    `
  }, []);

  const sendChat = useCallback(() => {
    if (!uname) {
      alert('ユーザ名を入力してください');
      return;
    }
    console.log('送信');
    socket.emit('chatToServer', { uname, text, time: getNow() })
    setText('');
  }, [uname, text]);

  return (
    <div>
      <h1>Websocket Component</h1>
      <h4>ユーザ名</h4>
      <TextField value={uname} onChange={(e) => { setUname(e.target.value) }} />

      <h3>トーク内容</h3>
      <Stack spacing={1}>
        {chatLog.map((chat, idx) => (
            <div key={idx}>
              <div>{chat.time}[{chat.socketId}]</div>
              <div>[{chat.uname}]: {chat.text}</div>
            </div>
          ))}
      </Stack>

      <h3>送信内容</h3>
      <TextField fullWidth value={text} onChange={(e) => { setText(e.target.value) }} />
      <Button variant="contained" onClick={sendChat}>Emit</Button>
    </div>
  )
}
