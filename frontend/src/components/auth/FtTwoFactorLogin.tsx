import { LoadingButton } from "@mui/lab";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import React, { useContext, useState } from "react";
import { RootWebsocketContext } from "../../contexts/WebsocketContext";

export default function FtTwoFactorLogin() {
  const router = useNavigate();
  const rootSocket: Socket = useContext(RootWebsocketContext);
  const [Loading, setLoading] = useState(true);
  const [otpCode, setOtpCode] = useState('');

  const onConfirmButton = async () => { // この処理の後にonSubmitを叩きたい
    let isLogin: Boolean = false;
    try {
      await axios.post('http://localhost:8080/auth/otp/validation', { otpcode: otpCode });
      setLoading(false);
      rootSocket.disconnect();
      isLogin = true;
      rootSocket.connect();
    } catch (error) {
      alert('ワンタイムパスワードが間違っています');
    } finally {
      setTimeout(() => {
        setLoading(true);
        if (isLogin) {
          router('/user');
        }
      }, 300);
    }
  }

  return (
    <>
        <Box>
          <Typography>Enter the 6-digit code from your 2FA app</Typography>
            <TextField
              value={otpCode}
              onChange={(e) => { setOtpCode(e.target.value) }}
              InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                    <LoadingButton
                        loading={!Loading}
                        variant="contained"
                        onClick={onConfirmButton}
                        sx={{ width: '5rem', height: '2.5rem' }}
                    >
                      Confirm
                      </LoadingButton>
                  </InputAdornment>
                  )
                }}
            />
        </Box>
    </>
  )
}
