import { Avatar, Box, Grid, Typography } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import axios from "axios";
import React, { createRef, useEffect, useLayoutEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { Message } from "../../../types/PrismaType";
import convertDate from "../../../utils/convertDate";

type MessagePayload = {
  memberId: string;
  time: string;
  senderName: string;
  text: string;
};

type ChatLog = MessagePayload[];

type ChatlogComponentProps = {
  memberId: string;
  roomId: string;
  socket: Socket;
}

export default function ChatlogComponent(props: ChatlogComponentProps) {
  const { roomId, socket, memberId } = props;
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
          const chat: MessagePayload = { memberId: obj.memberId, senderName: obj.senderName, time: convertDate(obj.createdAt), text: obj.message };
          setChatLog(prevChatLog => [...prevChatLog, chat]);
        })
      }
    }

    fetchChat();
  }, [roomId])

  return (
    <Box
      width={'95%'}
      sx={{ color: '#3C444B', overflow: 'auto'}}
    >
      {chatLog.map((chat, idx) => (
        memberId === chat.memberId ? (
          <Box
          key={idx}
          mb={2}
          width={'100%'}
          height={'5rem'}
          sx={{ display: 'flex', alignItems: 'center'}}
        >
          <Grid
            container
            alignItems={'end'}
            justifyContent={'flex-end'}
          >
              <Grid
                item
              >
                <Typography variant="caption" >You {chat.time}</Typography>
                <Box
                  sx={{ display: 'flex', justifyContent: 'end', wordBreak: 'break-word'}}
                  mr={2}
                >
                  <Box
                    maxWidth={'30rem'}
                    width={ chat.text.length * 0.7 > 8 ? `calc(0.6rem * ${chat.text.length})` : `calc(1.1rem * ${chat.text.length})`}
                    minHeight={'3rem'}
                    justifyContent='center'
                    sx={{
                      backgroundColor: '#d0d3e4', color: '#3C444B', display: 'flex', alignItems: 'center',
                      borderRadius: '20px 20px 0px 20px',
                    }}
                  >
                    <Box
                      width={'80%'}
                      textAlign={'center'}
                    >
                      {chat.text}
                    </Box>
                  </Box>
                </Box>
            </Grid>
            <Grid item mr={2}>
              <Avatar><PersonIcon/></Avatar>
            </Grid>
          </Grid>
        </Box>
        ) : (
          <Box
          key={idx}
          mb={2}
          width={'100%'}
          height={'5rem'}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Grid
            container
            alignItems={'end'}
          >
            <Grid item mr={2}>
              <Avatar><PersonIcon/></Avatar>
            </Grid>
            <Grid item>
              <Typography variant="caption" >{chat.senderName}  {chat.time}</Typography>
              <Box
                  sx={{ display: 'flex', wordBreak: 'break-word'}}
                  mr={2}
                >
                <Box
                  width={ chat.text.length * 0.7 > 8 ? `calc(0.6rem * ${chat.text.length})` : `calc(1.1rem * ${chat.text.length})`}
                  minHeight={'3rem'}
                  justifyContent='center'
                  sx={{
                    backgroundColor: '#ffffff', color: '#3C444B', display: 'flex', alignItems: 'center',
                    borderRadius: '20px 20px 20px 0px',
                  }}
                >
                  <Box
                    width={'80%'}
                    textAlign={'center'}
                  >
                    {chat.text}
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
        )
      ))}
      <div ref={latestChatRef} />
    </Box>
    )
}
