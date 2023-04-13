import { Avatar, Box, CircularProgress, Grid, Typography } from "@mui/material";
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
  memberImage: Map<string, string>;
}

export default function ChatlogComponent(props: ChatlogComponentProps) {
  const { roomId, socket, userId, memberImage } = props;
  const [chatLog, setChatLog] = useState<ChatLog>([]);
  const [Loading, setLoading] = useState(true);
  const latestChatRef = createRef<HTMLDivElement>();

  useEffect(() => {
    socket.on('chatToClient', async (chat: MessagePayload) => {
      const { data: IsBlock } = await axios.get(`http://localhost:8080/user/block/${chat.senderUserId}`);
      if (IsBlock === false)
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
        <Box
          height={'5rem'}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          >
              <Grid
                item
                xs
              >
                <Box
                  sx={{ display: 'flex', justifyContent: 'end'}}
                  mr={2}
                >
                  <Box textAlign={'left'}>
                    <Typography variant="caption" >You {chat.time}</Typography>
                    <Box
                      padding={'1rem'}
                      sx={{
                        backgroundColor: '#d0d3e4', color: '#3C444B', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', borderRadius: '20px 20px 0px 20px',
                      }}
                    >
                      <Box
                        textAlign={'left'}
                      >
                        {chat.text}
                      </Box>
                    </Box>
                  </Box>
                </Box>
            </Grid>
            <Grid item>
              <Avatar>
                  <img
                    src={memberImage.get(chat.senderUserId) as string}
                    alt="memberImage"
                    style={{ width: '100%', height: '100%' }}
                  />
              </Avatar>
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
            <Grid item>
              <Avatar>
                <img
                  src={memberImage.get(chat.senderUserId) as string}
                  alt="memberImage"
                  style={{ width: '100%', height: '100%' }}
                />
              </Avatar>
            </Grid>
            <Grid item xs>
              <Box
                sx={{ display: 'flex', justifyContent: 'start'}}
                ml={2}
               >
                <Box textAlign={'right'}>
                  <Typography variant="caption" >{chat.senderName}  {chat.time}</Typography>
                  <Box
                    padding={'1rem'}
                    sx={{
                      backgroundColor: '#ffffff', color: '#3C444B', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', borderRadius: '20px 20px 20px 0px',
                    }}
                  >
                    <Box
                      textAlign={'left'}
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
