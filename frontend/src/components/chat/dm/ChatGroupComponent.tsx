import { Grid, IconButton, TextField, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { Box } from "@mui/system";
import React, { useState } from "react";
import { Socket } from "socket.io-client";
import ChatFriendsComponent from "./ChatFriendsComponent";
import { ChatRoom } from "../../../types/PrismaType";
import OptionOpenButton from "../utils/OptionOpenButton";
import CreateDMRoomButton from "./CreateDMRoomButton";

type ChatGroupComponentProps = {
  socket: Socket;
  userName: string;
}

/**
 * @returns chatの会話中のフレンド、グループを表示するコンポーネント
 */
export default function ChatGroupComponent(props: ChatGroupComponentProps) {
  const { socket, userName } = props;
  const [DMRooms, setDMRooms] = useState<ChatRoom[]>([]);
  const [openLeaveButton, setOpenLeaveButton] = useState<boolean>(false);

  return (
    <>
      <Grid item
        xs={2.5}
      >
        <Grid container justifyContent={'center'}>
          <Box
            width={'90%'}
            height={'7vh'}
            borderBottom={2}
            borderColor={'#EDF0F4'}
            textAlign={'left'}
            sx={{ display: 'flex', alignItems: 'center' }}
            >
            <Typography
              variant="h5"
              ml={2}
              sx={{ color: '#3C444B' }}
            >
              DirectMessage
            </Typography>
          </Box>
          <Box
          width={'18vw'}
          marginTop={'2vh'}
            >
            <TextField
              fullWidth
              placeholder={'Search'}
              InputProps={{
                style: {
                  color: '#3C444B',
                  backgroundColor: '#EDF0F4',
                  borderRadius: 15,
                },
                endAdornment: (
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                )
              }}
              />
          </Box>
          <Grid
            container
            width={'90%'}
            height={'8vh'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Grid item>
              <Typography color={'#808792'}>
                Recent Chats
              </Typography>
            </Grid>
            <Grid item>
              <Box display={'flex'}>
                <CreateDMRoomButton setDMRooms={setDMRooms}/>
                <OptionOpenButton open={openLeaveButton} setOpen={setOpenLeaveButton} />
              </Box>
            </Grid>
          </Grid>
          <Box width={'90%'}>
            <ChatFriendsComponent
              socket={socket}
              DMRooms={DMRooms}
              setDMRooms={setDMRooms}
              isLeave={openLeaveButton}
              userName={userName}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  )
}
