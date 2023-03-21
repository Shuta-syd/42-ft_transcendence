import { Box, Grid, IconButton, TextField, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { Socket } from "socket.io-client";
import React, { useState } from "react";
import { ChatRoom } from "../../../types/PrismaType";
import ChannelListComponent from "./ChannelListComponent";
import ChannelMoreOption from "./ChannelMoreOption";
import '../../../styles/Chat.css';
import OptionOpenButton from "../utils/OptionOpenButton";

type ChannelGroupComponentProps = {
  socket: Socket;
}

/**
 * @returns 所属中のChannelリストを表示するコンポーネント
 */
export default function ChannelGroupComponent(props: ChannelGroupComponentProps) {
  const { socket } = props;
  const [channels, setChannels] = useState<ChatRoom[]>([]);
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
              Group Chat
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
                <ChannelMoreOption setChannels={setChannels} />
                <OptionOpenButton open={openLeaveButton} setOpen={setOpenLeaveButton} />
              </Box>
            </Grid>
          </Grid>
          <Box width={'90%'}>
            <ChannelListComponent socket={socket} setChannels={setChannels} channels={channels} isLeave={openLeaveButton} />
          </Box>
        </Grid>
      </Grid>
    </>
  )
}
