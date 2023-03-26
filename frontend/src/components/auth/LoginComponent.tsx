import { Box, Button, TextField, Stack } from "@mui/material";
import axios from "axios";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import FormController from "../utils/FormController";
import FtLoginButtonComponent from "./FtLoginButtonComponent";

type LoginData = {
  email: string;
  password: string;
}

function LoginComponent() {
  const { control, handleSubmit, reset } = useForm<LoginData>({ defaultValues: { email: '', password: '' } });

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    try {
      await axios.post('http://localhost:8080/auth/login', {
        email: data.email,
        password: data.password,
      });
      reset();
    } catch (error) {
      alert('ログインに失敗しました。もう一度ログインしてください');
    }
  }

  return (
    <Box width={'40rem'}>
      <Box
        height={'5rem'}
        border={2}
        borderRadius={'5px'}
        borderColor={'#e0e3e9'}
        mt={'3rem'}
        mb={'3rem'}
      >
        Title
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{ width: '100%'}}
          height={'30rem'}
          border={2}
          borderRadius={'5px'}
          borderColor={'#e0e3e9'}
        >
          <Box
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <Stack
              spacing={3}
              width={'90%'}
              >
              <FormController
                name='email'
                control={control}
                RenderComponent={(field: any) => (
                  <TextField fullWidth {...field} label='Enter Your Email Address' />
                )}
              />
              <FormController
                name='password'
                control={control}
                RenderComponent={(field: any) => (
                  <TextField fullWidth {...field} label='Enter Password' />
                  )}
                  />
              <Button type="submit" variant="contained">Login</Button>
              <FtLoginButtonComponent />
            </Stack>
          </Box>
        </Box>
      </form>
    </Box>
  )
}

export default LoginComponent;
