import { Box, Grid, IconButton, TextField, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { Socket } from "socket.io-client";
import React, { useState } from "react";
import { ChatRoom } from "../../types/PrismaType";
import NewChannelListComponent from "./NewChannelListComponent";

type ChannelGroupComponentProps = {
  socket: Socket;
}

/**
 * @returns 所属中のChannelリストを表示するコンポーネント
 */
export default function NewChannelGroupComponent(props: ChannelGroupComponentProps) {
  const { socket } = props;
  const [channels, setChannels] = useState<ChatRoom[]>([]);

  return (
    <>
      <Grid item
        height={'100vh'}
        borderLeft={2}
        borderColor={'#EDF0F4'}
        borderRadius={8}
        xs={2.5}
      >
        <Grid container justifyContent={'center'}>
          <Box
            width={'18vw'}
            height={'10vh'}
            borderBottom={2}
            borderColor={'#EDF0F4'}
            textAlign={'left'}
            sx={{ display: 'flex', alignItems: 'center' }}
            >
            <Typography
            variant="h5"
            marginTop={2}
            marginLeft={2}
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
              label={'Search'}
              InputProps={{
                style: {
                  color: '#3C444B',
                  backgroundColor: '#EDF0F4',
                  borderColor: '#EDF0F4',
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
            width={'18vw'}
            height={'8vh'}
            alignItems={'center'}
          >
            <Grid item>
              <Typography color={'#808792'}>
                Recent Chats
              </Typography>
            </Grid>
            <Grid item>
              {/* Button */}
            </Grid>
          </Grid>
          <NewChannelListComponent socket={socket} setChannels={setChannels} channels={channels} />
        </Grid>
      </Grid>
    </>
  )
}
