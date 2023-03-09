import { AppBar, Toolbar, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <AppBar position="static" sx={{backgroundColor: "#0f044c", height: '6vh'}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Typography mr={5}>
              <Link to={"/"} className={'NavbarLink'}>Login</Link>
            </Typography>
            <Typography mr={5}>
              <Link to={"/chat/room"} className={'NavbarLink'}>Chat</Link>
            </Typography>
            <Typography mr={5}>
              <Link to={"/channel/room"} className={'NavbarLink'}>Channel</Link>
            </Typography>
            <Typography mr={5}>
            <Link to={"/game"} className={'NavbarLink'}>Game</Link>
            </Typography>
            <Typography mr={5}>
              <Link to={"/match"} className={'NavbarLink'}>Match</Link>
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
