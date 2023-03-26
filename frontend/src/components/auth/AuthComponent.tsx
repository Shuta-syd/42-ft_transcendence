import { Box } from "@mui/material";
import React from "react";
import LoginComponent from "./LoginComponent";

export default function AuthComponent() {
  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'center' }}
    >
      <LoginComponent />
    </Box>
    )
}
