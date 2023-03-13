/* eslint-disable no-unused-vars */
import { Avatar, Box, IconButton, Stack } from "@mui/material";
import Looks4Icon from '@mui/icons-material/Looks4';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import ForumIcon from '@mui/icons-material/Forum';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import React from "react";

export default function NewNavBar() {
  return (
    <>
      <Box
        width={'5vw'} height={'100vh'}
        sx={{
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        borderRight={1}
      >
        <Avatar>
          <Looks4Icon fontSize="large"/>
        </Avatar >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <IconButton>
            <VideogameAssetIcon fontSize="large" />
          </IconButton>
          <IconButton>
            <ChatIcon fontSize="large"/>
          </IconButton>
          <IconButton>
            <ForumIcon fontSize="large" />
          </IconButton>
        </Box>
        <Avatar>
          <PersonIcon/>
        </Avatar>
      </Box>
    </>
  )
}
