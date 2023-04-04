import { Box, Button, TextField, Stack, Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from '@hookform/resolvers/yup';
import FormController from "../utils/FormController";
import FtLoginButtonComponent from "./FtLoginButtonComponent";
import LoginValidationSchema from "../../types/auth/LoginValidationSchema";

type LoginData = {
  email: string;
  password: string;
}

function LoginComponent() {
  const router = useNavigate();
  const { control, handleSubmit, reset, formState: { errors } } = useForm<LoginData>({
    mode: 'onSubmit',
    defaultValues: { email: '', password: '' },
    resolver: yupResolver(LoginValidationSchema),
  });

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    try {
      await axios.post('http://localhost:8080/auth/login', {
        email: data.email,
        password: data.password,
      });
      reset();
      router('/user');
    } catch (error: any) {
      if (error.response) {
        const { message } = error.response.data;
        alert(message);
      }else
      alert('ログインに失敗しました。もう一度ログインしてください');
    }
  }

  const handleClick = async () => {
    await axios.post('http://localhost:8080/auth/logout');
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
            <Stack
              spacing={3}
            width={'90%'}
            textAlign='center'
          >
            <Typography variant="h5">Login</Typography>
              <FormController
                name='email'
                control={control}
                RenderComponent={(field: any) => (
                  <TextField
                    fullWidth
                    {...field}
                    label='email'
                    placeholder='Enter Your Email Address'
                    helperText={errors.email?.message}
                    error={Boolean(errors.email)}
                  />
                )}
              />
              <FormController
                name='password'
                control={control}
                RenderComponent={(field: any) => (
                  <TextField
                    fullWidth
                    {...field}
                    label='password'
                    placeholder='Enter Password'
                    type={'password'}
                    helperText={errors.password?.message}
                    error={Boolean(errors.password)}
                  />
                  )}
                  />
              <Button type="submit" variant="contained">Login</Button>
              <FtLoginButtonComponent />
            </Stack>
          </Box>
        <Link to='/signup'>signup user</Link>
        <Button onClick={handleClick}>LOGOUT</Button>
        </Box>
    </form>
  )
}

export default LoginComponent;
