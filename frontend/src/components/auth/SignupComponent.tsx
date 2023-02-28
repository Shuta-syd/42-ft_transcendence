import { Button, Grid} from "@mui/material";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import FormController from "../utils/FormController";

type SignupData = {
  username: string;
  email: string;
  password: string;
}

function SignupComponent() {
  const { control, handleSubmit } = useForm<SignupData>({ defaultValues: { username: '', email: '', password: '' } });

  const onSubmit: SubmitHandler<SignupData> = (data) => {
    console.log(data);
  }

  return (
    <Grid>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Signup Component</h2>
        <FormController
          name="username"
          placeholder="type username"
          control={control}
        />
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
        <Button type="submit" variant="contained">SIGNUP</Button>
      </form>
    </Grid>
  )
}

export default SignupComponent;
