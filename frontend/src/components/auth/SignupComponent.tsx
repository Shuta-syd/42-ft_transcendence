/* eslint-disable no-unused-vars */
import { Box, Stack, Typography } from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Socket } from "socket.io-client";
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from "react-router-dom";
import SignupStepper from "./SignupStepper";
import UploadImageComponent from "./UploadImageComponent";
import SignupValidationSchema from "../../types/auth/SignupValidationSchema";
import UserProfileFormComponent from "./UserProfileFormComponent";
import TwoFactorSettingComponent from "./TwoFactorSettingComponent";
import { RootWebsocketContext } from "../../contexts/WebsocketContext";
import defaultAvatarBase64 from "../../assets/default-avatar-base64";

type SignupData = {
  username: string;
  email: string;
  password: string;
}


function SignupComponent() {
  const rootSocket: Socket = useContext(RootWebsocketContext);
  const [activeStep, setActiveStep] = useState(0);
  const [image, setImage] = useState(defaultAvatarBase64);
  const [imageURL, setImageURL] = useState(defaultAvatarBase64);
  const { control, handleSubmit, reset, formState: { errors, isValid } } = useForm<SignupData>({
    mode: 'all',
    defaultValues: { username: '', email: '', password: '' },
    resolver: yupResolver(SignupValidationSchema),
  });

  const onSubmit: SubmitHandler<SignupData> = async (data) => {
    try {
      rootSocket.disconnect();
      await axios.post('http://localhost:8080/auth/signup', {
          name: data.username,
          email: data.email,
          password: data.password,
          image,
        })
      reset();
      setActiveStep(2);
      rootSocket.connect();
    } catch (error: any) {
      alert(error.response.data.message);
      setActiveStep(0);
    }
  }

  const onFileChange = (e: any) => {
    if (e.target.files === null) return;
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
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
            {(() => {
              switch (activeStep) {
                case 0:
                  return <UserProfileFormComponent control={control} setActiveStep={setActiveStep} errors={errors} isValid={isValid} />
                case 1:
                  return <UploadImageComponent image={imageURL} onFileChange={onFileChange} setActiveStep={setActiveStep} />
                case 2:
                  return <TwoFactorSettingComponent />
                default:
                  return null;
              }
            })()}
          </Stack>
        </Box>
        <Link to='/login'>login user</Link>
        </Box>
      </form>
  )
}

export default SignupComponent;
