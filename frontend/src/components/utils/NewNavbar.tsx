import { Box, Grid, IconButton, Stack } from "@mui/material";
import Looks4Icon from '@mui/icons-material/Looks4';
import VideogameAssetOutlinedIcon from '@mui/icons-material/VideogameAssetOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import PersonIcon from '@mui/icons-material/Person';
import React from "react";
import '../../styles/Navbar.css'
import { Link, useLocation } from "react-router-dom";

export default function NewNavBar() {
  const path = useLocation().pathname;

  return (
    <Grid item>
      <Box
        width={'6rem'} height={'100vh'}
        sx={{
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
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
            className={'NavbarButtonParent'}
            borderRight={path.includes('/game') ? 4 : 0}
            borderColor={'#1f9f88'}
          >
            <Box
              borderRadius={4}
              className={ path.includes('/game') ? 'NavbarActive' : ''}
            >
              <Link to={'/game'}>
                <IconButton>
                  <VideogameAssetOutlinedIcon
                    fontSize="large"
                    className={ path.includes('/game') ? 'NavbarButtonActive' : 'NavbarButton'}
                    />
                </IconButton>
              </Link>
            </Box>
          </Box>
          <Box
            className={'NavbarButtonParent'}
            borderRight={path.includes('/chat/room') ? 4 : 0}
            borderColor={'#1f9f88'}
          >
            <Box
              borderRadius={4}
              className={path.includes('/chat/room') ? 'NavbarActive' : ''}
            >
              <Link to={'/chat/room'}>
                <IconButton>
                  <ChatOutlinedIcon
                    fontSize="large"
                    className={ path.includes('/chat/room') ? 'NavbarButtonActive' : 'NavbarButton'}
                    />
                </IconButton>
              </Link>
            </Box>
          </Box>
          <Box
            className={'NavbarButtonParent'}
            borderRight={path.includes('/channel/room') ? 4 : 0}
            borderColor={'#1f9f88'}
          >
            <Box
              borderRadius={4}
              className={ path.includes('/channel/room') ? 'NavbarActive' : ''}
            >
              <Link to={'/channel/room'}>
                <IconButton>
                  <ForumOutlinedIcon
                    fontSize="large"
                    className={ path.includes('/channel/room') ? 'NavbarButtonActive' : 'NavbarButton'}
                    />
                </IconButton>
              </Link>
            </Box>
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
    </Grid>
  )
}
