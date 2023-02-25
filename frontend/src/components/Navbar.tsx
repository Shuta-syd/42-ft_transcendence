/* eslint-disable import/no-extraneous-dependencies */
import { AppBar, Toolbar, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Typography mr={5}>
              <Link to={"/"}>Home</Link>
            </Typography>
            <Typography mr={5}>
              <Link to={"/chat/room"}>Chat</Link>
            </Typography>
            <Typography mr={5}>
              <Link to={"/game"}>Game</Link>
            </Typography>
            <Typography mr={5}>
               <Link to={"/match"}>Match</Link>
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
