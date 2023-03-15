/* eslint-disable no-unused-vars */
import { Box, Grid, IconButton, Stack, TextField, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { Socket } from "socket.io-client";
import React from "react";

type ChannelGroupComponentProps = {
  socket: Socket;
}

export default function NewChannelGroupComponent(props: ChannelGroupComponentProps) {
  const { socket } = props;

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
        </Grid>
      </Grid>
    </>
  )
}
