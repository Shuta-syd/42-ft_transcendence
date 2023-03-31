import { Button, TextField } from "@mui/material";
import React from "react";
import FormController from "../utils/FormController";
import FtLoginButtonComponent from "./FtLoginButtonComponent";

type UserProfileFormComponentProps = {
  control: any; // useForm control
  setActiveStep: any; // useState setter
  errors: any; // useForm formState errors
  isValid: boolean; // form is error or not
}

export default function UserProfileFormComponent(props: UserProfileFormComponentProps) {
  const { control, setActiveStep, errors, isValid } = props;

  const onNextButton = () => {
    setActiveStep(1);
  }

  return (
    <>
      <FormController
        name='username'
        control={control}
        RenderComponent={(field: any) => (
          <TextField
            required
            fullWidth
            {...field}
            label='username'
            placeholder='Enter Your UserName'
            type={'username'}
            helperText={errors.username?.message}
            error={Boolean(errors.username)}
          />
        )}
      />
      <FormController
        name='email'
        control={control}
        RenderComponent={(field: any) => (
          <TextField
            required
            fullWidth
            {...field}
            label='email'
            type={'email'}
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
            required
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
      <Button disabled={!isValid} variant="contained" onClick={onNextButton} >Next Step</Button>
      <FtLoginButtonComponent />
    </>
  )
}
