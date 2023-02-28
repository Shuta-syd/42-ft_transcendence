import { Button, Grid } from "@mui/material";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import FormController from "../utils/FormController";

type LoginData = {
  email: string;
  password: string;
}

function LoginComponent() {
  const { control, handleSubmit } = useForm<LoginData>({ defaultValues: { email: '', password: '' } });

  const onSubmit: SubmitHandler<LoginData> = (data) => {
    console.log(data);
  }

  return (
    <Grid>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Login Component</h2>
        <FormController
          name="email"
          placeholder="type email"
          control={control}
        />
        <FormController
          name="password"
          placeholder="type password"
          control={control}
        />
        <Button type="submit" variant="contained">Login</Button>
      </form>
    </Grid>
  )
}

export default LoginComponent;
