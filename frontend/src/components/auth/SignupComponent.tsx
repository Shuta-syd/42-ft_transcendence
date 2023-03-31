/* eslint-disable no-unused-vars */
import { Box, Stack, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from "react-router-dom";
import SignupStepper from "./SignupStepper";
import UploadImageComponent from "./UploadImageComponent";
import UserProfileFormComponent from "./UserProfileFormComponent";
import SignupValidationSchema from "../../types/auth/SignupValidationSchema";

type SignupData = {
  username: string;
  email: string;
  password: string;
}


function SignupComponent() {
  const router = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [image, setImage] = useState('');
  const [imageURL, setImageURL] = useState('');
  const { control, handleSubmit, reset, formState: { errors } } = useForm<SignupData>({
    defaultValues: { username: '', email: '', password: '' },
    resolver: yupResolver(SignupValidationSchema),
  });

  const onSubmit: SubmitHandler<SignupData> = async (data) => {
    try {
      await axios.post('http://localhost:8080/auth/signup', {
        name: data.username,
        email: data.email,
        password: data.password,
        image,
      });
      reset();
      router('/login');
    } catch (error) {
      reset();
      setActiveStep(0);
      alert('ユーザ作成に失敗しました。もう一度ユーザ作成をしてください');
    }
  }

  const onFileChange = (e: any) => {
    if (e.target.files === null) return;
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
      setImage(base64);
    }
    reader.readAsDataURL(file);
    setImageURL(URL.createObjectURL(file));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{ width: '100%'}}
        height={'35rem'}
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
              <UserProfileFormComponent control={control} setActiveStep={setActiveStep} errors={ errors } />
            ) : (
                <UploadImageComponent image={imageURL} onFileChange={onFileChange} setActiveStep={setActiveStep}  />
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
