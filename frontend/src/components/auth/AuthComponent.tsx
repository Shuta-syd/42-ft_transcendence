import { Box } from "@mui/material";
import React from "react";
import AuthTitleComponent from "./AuthTitleComponent";
import LoginComponent from "./LoginComponent";
import SignupComponent from "./SignupComponent";
import FtSignupComponent from "./FtSignupComponent";

export default function AuthComponent(props: { type: string }) {

  let Component;

  switch (props.type) {
    case 'login':
      Component = <LoginComponent />
      break;
    case 'signup':
      Component = <SignupComponent />
      break;
    case 'signup/42':
      Component = <FtSignupComponent />;
      break;
  }

  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'center' }}
    >
      <Box width={'40rem'}>
        <AuthTitleComponent />
        { Component }
      </Box>
    </Box>
    )
}
