import { AppBar, Link, Toolbar, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import React from "react";

function Navbar() {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Typography mr={5}>
              <Link href=" /" color={"#fffff"}>Home</Link>
            </Typography>
            <Typography>
              <Link href=" /chat" color={"#fffff"}>Chat</Link>
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
