import { Button, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import FormController from "../utils/FormController";
import FtLoginButtonComponent from "./FtLoginButtonComponent";

type LoginFormComponentProps = {
  control: any;
  errors: any;
}

export default function LoginFormComponent(props: LoginFormComponentProps) {
  const { control, errors } = props;

  return (
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
  )
}
