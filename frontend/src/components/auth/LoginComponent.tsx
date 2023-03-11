import { Button, Grid, TextField } from "@mui/material";
import axios from "axios";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import FormController from "../utils/FormController";

type LoginData = {
  email: string;
  password: string;
}

function LoginComponent() {
  const { control, handleSubmit, reset } = useForm<LoginData>({ defaultValues: { email: '', password: '' } });

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    try {
      const res = await axios.post('http://localhost:8080/auth/login', {
        email: data.email,
        password: data.password,
      });
      console.log(res.data);
      reset();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Grid>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Login Component</h2>
        <FormController
          name="email"
          control={control}
          RenderComponent={(field: any) => (
            <TextField {...field} label={'email'} placeholder={'email'}/>
          )}
        />
        <FormController
          name="password"
          control={control}
          RenderComponent={(field: any) => (
            <TextField {...field} label={'password'} placeholder={'password'}/>
          )}
        />
        <Button type="submit" variant="contained">Login</Button>
      </form>
    </Grid>
  )
}

export default LoginComponent;
