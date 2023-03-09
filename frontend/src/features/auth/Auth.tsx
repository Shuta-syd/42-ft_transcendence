/* eslint-disable no-unused-vars */
import { Button } from "@mui/material";
import axios from "axios";
import React from "react";
import LoginComponent from "../../components/auth/LoginComponent";
import SignupComponent from "../../components/auth/SignupComponent";

function Auth() {
  const handleClick = async () => {
    const res = await axios.post('http://localhost:8080/auth/logout');
    console.log(res.data);
  }

  return (
    <>
      <LoginComponent />
      <SignupComponent />
      <Button variant="contained" onClick={handleClick}>LOGOUT</Button>
    </>
  )
}

export default Auth;
