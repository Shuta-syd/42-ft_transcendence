import { Box } from "@mui/material";
import React from "react";
import AuthTitleComponent from "./AuthTitleComponent";
import LoginComponent from "./LoginComponent";
import SignupComponent from "./SignupComponent";

export default function AuthComponent(props: { isLogin: boolean }) {

  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'center' }}
    >
      <Box width={'40rem'}>
        <AuthTitleComponent />
        {props.isLogin ? (<LoginComponent />) : (<SignupComponent />)}
      </Box>
    </Box>
    )
}
