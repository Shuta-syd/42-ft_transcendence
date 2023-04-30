import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { yupResolver } from '@hookform/resolvers/yup';
import LoginValidationSchema from "../../types/auth/LoginValidationSchema";
import { RootWebsocketContext } from "../../contexts/WebsocketContext";
import LoginFormComponent from "./LoginFormComponent";

type LoginData = {
  email: string;
  password: string;
}

function LoginComponent() {
  const router = useNavigate();
  const [otpValid, setOtpValid] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [Loading, setLoading] = useState(true);
  const rootSocket: Socket = useContext(RootWebsocketContext);
  const { control, handleSubmit, reset, getValues ,formState: { errors } } = useForm<LoginData>({
    mode: 'onSubmit',
    defaultValues: { email: '', password: '' },
    resolver: yupResolver(LoginValidationSchema),
  });

  useEffect(() => {
    rootSocket.connect();
  }, [rootSocket])

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    let isLogin: Boolean = false;
    try {
      const { data: isOptOn } = await axios.post('http://localhost:8080/auth/otp/is', {
        email: data.email,
        password: data.password,
      });
      if (isOptOn && !otpValid) {
        setActiveStep(1);
        return;
      }
      await axios.post('http://localhost:8080/auth/login', {
        email: data.email,
        password: data.password,
      });
      rootSocket.disconnect();
      reset();
      isLogin = true;
      rootSocket.connect();
    } catch (error: any) {
      if (error.response) {
        const { message } = error.response.data;
        alert(message);
      }else
      alert('ログインに失敗しました。もう一度ログインしてください');
    } finally {
      if (isLogin) {
        router('/user');
      }
    }
  }

  const handleClick = async () => {
    rootSocket.emit('online_status_delete');
    await axios.post('http://localhost:8080/auth/logout');
  }

  const onConfirmButton = async () => { // この処理の後にonSubmitを叩きたい
    let isLogin: Boolean = false;
    try {
      await axios.post('http://localhost:8080/auth/otp/login', { otpcode: otpCode, email: getValues('email'), password: getValues('password')});
      setOtpValid(true);
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{ width: '100%'}}
        height={'30rem'}
        border={2}
        borderRadius={'5px'}
        borderColor={'#e0e3e9'}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          height={'100%'}
        >
      {(() => {
        switch (activeStep) {
          case 0:
            return  <LoginFormComponent control={control} errors={errors} />
          case 1:
            return (
              <Box>
                <Typography>Enter the 6-digit code from your 2FA app</Typography>
                  <TextField
                    value={otpCode}
                    onChange={(e) => { setOtpCode(e.target.value) }}
                    fullWidth
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
            )
          default:
            return null;
              }
          })()}
        </Box>
        <Link to='/signup'>signup user</Link>
        <Button onClick={handleClick}>LOGOUT</Button>
      </Box>
    </form>
  )
}

export default LoginComponent;
