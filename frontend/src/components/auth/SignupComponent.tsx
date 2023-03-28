import { Box, Stack, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import SignupStepper from "./SignupStepper";
import UploadImageComponent from "./UploadImageComponent";
import UserProfileFormComponent from "./UserProfileFormComponent";

type SignupData = {
  username: string;
  email: string;
  password: string;
  image: string;
}


function SignupComponent() {
  const [activeStep, setActiveStep] = useState(0);
  const { control, handleSubmit, reset } = useForm<SignupData>({ defaultValues: { email: '', password: '', image: '' } });

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
            textAlign='center'
          >
            <Typography variant="h5">Signup</Typography>
            <SignupStepper activeStep={activeStep} />
            {activeStep === 0 ? (
                <UserProfileFormComponent control={control} setActiveStep={setActiveStep} />
            ) : (
                <UploadImageComponent control={control} setActiveStep={setActiveStep} />
            )
            }
          </Stack>
        </Box>
        <Link to='/login'>login user</Link>
        </Box>
      </form>
  )
}

export default SignupComponent;
