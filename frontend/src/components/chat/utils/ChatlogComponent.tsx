import { Box } from "@mui/material";
import axios from "axios";
import React, { createRef, useEffect, useLayoutEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { Message } from "../../../types/PrismaType";
import convertDate from "../../../utils/convertDate";

type MessagePayload = {
  time: string;
  senderName: string;
  text: string;
};

type ChatLog = MessagePayload[];

type ChatlogComponentProps = {
  roomId: string;
  socket: Socket;
}

export default function ChatlogComponent(props: ChatlogComponentProps) {
  const { roomId, socket } = props;
  const [chatLog, setChatLog] = useState<ChatLog>([]);
  const latestChatRef = createRef<HTMLDivElement>();

  useEffect(() => {
    socket.on('chatToClient', (chat: MessagePayload) => {
      setChatLog(prevChatLog => [...prevChatLog, chat]);
    });
  }, [])

  useLayoutEffect(() => {
    latestChatRef.current?.scrollIntoView();
  }, [chatLog])

  useLayoutEffect(() => {
    const fetchChat = async () => {
      setChatLog([]);
      const { data } = await axios.get<Message[]>(`http://localhost:8080/chat/room/log/${roomId}`);
      if (data) {
        data?.map((obj) => {
          const chat: MessagePayload = { senderName: obj.senderName, time: convertDate(obj.createdAt), text: obj.message };
          setChatLog(prevChatLog => [...prevChatLog, chat]);
        })
      }
    }

    fetchChat();
  }, [roomId])

  return (
    <Box
      width={'95%'}
      sx={{ color: '#3C444B', overflow: 'auto' ,overflowWrap: 'break-word', wordWrap: 'break-word' }}
    >
      {chatLog.map((chat, idx) =>
      (
        <div key={idx}>
          <div>{chat.time}</div>
          <div>{chat.senderName}: {chat.text}</div>
        </div>
      ))}
      <div ref={latestChatRef} />
    </Box>
    )
}
