import { Button, TextField } from "@mui/material";
import React from "react";
import FormController from "../utils/FormController";
import FtLoginButtonComponent from "./FtLoginButtonComponent";

type UserProfileFormComponentProps = {
  control: any; // useForm control
  setActiveStep: any; // useState setter
}

export default function UserProfileFormComponent(props: UserProfileFormComponentProps) {
  const { control, setActiveStep } = props;

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
          <TextField fullWidth {...field} label='Enter Password' type={'password'}/>
          )}
          />
      <Button variant="contained" onClick={() => { setActiveStep(1); }} >Next Step</Button>
      <FtLoginButtonComponent />
    </>
  )
}
