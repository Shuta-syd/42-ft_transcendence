/* eslint-disable no-unused-vars */
import { Avatar, Box, IconButton, Stack } from "@mui/material";
import Looks4Icon from '@mui/icons-material/Looks4';
import VideogameAssetOutlinedIcon from '@mui/icons-material/VideogameAssetOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import PersonIcon from '@mui/icons-material/Person';
import React from "react";
import '../../styles/Navbar.css'
import { Link } from "react-router-dom";

export default function NewNavBar() {
  return (
    <>
      <Box
        width={'6rem'} height={'100vh'}
        sx={{
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
        borderRight={1}
      >
        <Box
          marginTop={'3vh'}
        >
          <Link to={'/'}>
            <IconButton>
              <Looks4Icon
                fontSize="large"
                sx={{color: '#B2B9C5'}}
                />
            </IconButton>
          </Link>
        </Box>
        <Stack
          spacing={7}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            className={'NavbarActive'}
            borderRadius={4}
          >
            <Link to={'/game'}>
              <IconButton>
                <VideogameAssetOutlinedIcon
                  fontSize="large"
                  sx={{ color: '#1f9f88' }}
                  className={'NavbarButton'}
                  />
              </IconButton>
            </Link>
          </Box>
          <Box>
            <Link to={'/chat/room'}>
              <IconButton>
                <ChatOutlinedIcon
                  fontSize="large"
                  sx={{color: '#B2B9C5'}}
                  />
              </IconButton>
            </Link>
          </Box>
          <Box>
            <Link to={'/channel/room'}>
              <IconButton>
                <ForumOutlinedIcon
                  fontSize="large"
                  sx={{color: '#B2B9C5'}}
                  />
              </IconButton>
            </Link>
          </Box>
        </Stack>
        <Box
          height={'5vh'}
          marginBottom={'3vh'}
        >
          <Link to={'/user'}>
            <IconButton>
                <PersonIcon
                  sx={{color: '#B2B9C5'}}
                  />
            </IconButton>
          </Link>
        </Box>
      </Box>
    </>
  )
}
