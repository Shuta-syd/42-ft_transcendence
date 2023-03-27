import { Button, TextField } from "@mui/material";
import React from "react";
import FormController from "../utils/FormController";
import FtLoginButtonComponent from "./FtLoginButtonComponent";

type UserProfileFormComponentProps = {
  control: any; // useForm control
}

export default function UserProfileFormComponent(props: UserProfileFormComponentProps) {
  const { control } = props;

  return (
    <>
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
      <FtLoginButtonComponent />
    </>
  )
}
