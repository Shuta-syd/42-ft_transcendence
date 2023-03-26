import { Box } from "@mui/material";
import React from "react";
import AuthTitleComponent from "./AuthTitleComponent";
import LoginComponent from "./LoginComponent";

export default function AuthComponent() {
  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'center' }}
    >
      <Box width={'40rem'}>
        <AuthTitleComponent />
        <LoginComponent />
      </Box>
    </Box>
    )
}
