import { Box, Button, TextField, Stack } from "@mui/material";
import axios from "axios";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import FormController from "../utils/FormController";

type SignupData = {
  username: string;
  email: string;
  password: string;
}

function SignupComponent() {
  const { control, handleSubmit, reset } = useForm<SignupData>({ defaultValues: { email: '', password: '' } });

  const onSubmit: SubmitHandler<SignupData> = async (data) => {
    try {
      await axios.post('http://localhost:8080/auth/signup', {
        name: data.username,
        email: data.email,
        password: data.password,
      });
      reset();
    } catch (error) {
      alert('ユーザ作成に失敗しました。もう一度ユーザ作成をしてください');
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
            <Stack
              spacing={3}
              width={'90%'}
              >
              <FormController
                name='username'
                control={control}
                RenderComponent={(field: any) => (
                  <TextField fullWidth {...field} label='Enter Your UserName' />
                )}
              />
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
              <Button type="submit" variant="contained">SignUp</Button>
            </Stack>
          </Box>
        </Box>
      </form>
  )
}

export default SignupComponent;
