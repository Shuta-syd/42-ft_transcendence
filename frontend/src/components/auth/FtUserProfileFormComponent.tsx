import { Button, TextField } from "@mui/material";
import React from "react";
import FormController from "../utils/FormController";

type FtUserProfileFormComponentProps = {
  control: any; // useForm control
  setActiveStep: any; // useState setter
  errors: any; // useForm formState errors
  isValid: boolean; // form is error or not
  email: string;
}

export default function FtUserProfileFormComponent(props: FtUserProfileFormComponentProps) {
  const { control, setActiveStep, errors, isValid, email } = props;

  const onNextButton = () => {
    if (isValid)
      setActiveStep(1);
    else
      alert('入力に誤りがあります。');
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
      <TextField
        name='email'
        label='email'
        type={'email'}
        disabled
        value={email}
      />
      <Button variant="contained" onClick={onNextButton} >Next Step</Button>
    </>
  )
}
