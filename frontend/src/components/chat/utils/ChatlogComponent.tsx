import { Avatar, Box, CircularProgress, Grid, Typography } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import axios from "axios";
import React, { createRef, useEffect, useLayoutEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { Message } from "../../../types/PrismaType";
import convertDate from "../../../utils/convertDate";

type MessagePayload = {
  senderUserId: string;
  time: string;
  senderName: string;
  text: string;
};

type ChatLog = MessagePayload[];

type ChatlogComponentProps = {
  userId: string;
  roomId: string;
  socket: Socket;
}

export default function ChatlogComponent(props: ChatlogComponentProps) {
  const { roomId, socket, userId } = props;
  const [chatLog, setChatLog] = useState<ChatLog>([]);
  const [Loading, setLoading] = useState(true);
  const latestChatRef = createRef<HTMLDivElement>();

  useEffect(() => {
    socket.on('chatToClient', (chat: MessagePayload) => {
      setChatLog(prevChatLog => [...prevChatLog, chat]);
    });
  }, [socket])

  useLayoutEffect(() => {
    latestChatRef.current?.scrollIntoView();
  }, [chatLog, latestChatRef])

  useEffect(() => {
    const fetchChat = async () => {
      setChatLog([]);
      const { data } = await axios.get<Message[]>(`http://localhost:8080/chat/room/log/${roomId}`);
      if (data) {
        data?.map((obj) => {
          const chat: MessagePayload = { senderUserId: obj.senderUserId, senderName: obj.senderName, time: convertDate(obj.createdAt), text: obj.message };
          setChatLog(prevChatLog => [...prevChatLog, chat]);
        })
      }
    }

    try {
      fetchChat();
    } catch (error) {
      alert('チャットを正しくロードできませんでした。ブラウザをリフレッシュしてください');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  }, [roomId])

  if (Loading) {
    return (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </>
    )
  }

  return (
    <Box
      width={'95%'}
      height={'100%'}
      sx={{ color: '#3C444B', overflow: 'auto'}}
    >
      {chatLog.map((chat, idx) => (
        userId === chat.senderUserId ? (
          <Box
            key={idx}
            mb={2}
            width={'100%'}
            sx={{ display: 'flex', alignItems: 'center'}}
          >
          <Grid
            container
            alignItems={'end'}
            justifyContent={'flex-end'}
          >
              <Grid
                item
                xs
              >
                <Box
                  sx={{ display: 'flex', justifyContent: 'end'}}
                  mr={2}
                >
                  <Box>
                    <Typography variant="caption" >You {chat.time}</Typography>
                    <Box
                      mb={1}
                      padding={'1rem'}
                      justifyContent='center'
                      sx={{
                        backgroundColor: '#d0d3e4', color: '#3C444B', display: 'flex', alignItems: 'center',
                        borderRadius: '20px 20px 0px 20px',
                      }}
                    >
                      <Box
                        maxWidth={'95%'}
                        textAlign={'center'}
                      >
                        {chat.text}
                      </Box>
                    </Box>
                  </Box>
                </Box>
            </Grid>
            <Grid item xs={0.5}>
              <Avatar><PersonIcon/></Avatar>
            </Grid>
          </Grid>
        </Box>
        ) : (
          <Box
          key={idx}
          mb={2}
          width={'100%'}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Grid
            container
            alignItems={'end'}
          >
                <Grid item mr={2} xs={0.5}>
              <Avatar><PersonIcon/></Avatar>
            </Grid>
            <Grid item xs>
              <Box
                sx={{ display: 'flex'}}
               >
                <Box>
                  <Typography variant="caption" >{chat.senderName}  {chat.time}</Typography>
                  <Box
                    mb={1}
                    padding={'1rem'}
                    sx={{
                      backgroundColor: '#ffffff', color: '#3C444B', display: 'flex', alignItems: 'center',
                      borderRadius: '20px 20px 20px 0px',
                    }}
                  >
                    <Box
                      maxWidth={'95%'}
                    >
                      {chat.text}
                    </Box>
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
