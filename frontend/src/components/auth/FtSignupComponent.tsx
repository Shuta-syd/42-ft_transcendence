/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box,  CircularProgress,  Stack, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import UploadImageComponent from "./UploadImageComponent";
import TwoFactorSettingComponent from "./TwoFactorSettingComponent";
import SignupStepper from "./SignupStepper";
import FtUserProfileFormComponent from "./FtUserProfileFormComponent";

type FtSignUpData = {
  username: string;
  image?: string;
}

export default function FtSignupComponent() {
  const [activeStep, setActiveStep] = useState(0);
  const [Loading, setLoading] = useState(true);
  const [imageURL, setImageURL] = useState('');
  const [email, setEmail] = useState('');
  const { control, handleSubmit, reset, setValue ,formState: { errors, isValid } } = useForm<FtSignUpData>({
    mode: 'all',
    defaultValues: { username: '', image: ''},
  });

  const onSubmit: SubmitHandler<FtSignUpData> = async (data: any) => {
    try {
      await axios.patch('http://localhost:8080/user/update', {
          name: data.username,
          image: data.image,
        })
      reset();
      setActiveStep(2);
    } catch (error) {
      console.log(error)
      alert('ユーザ情報更新に失敗しました。ブラウザをリフレッシュしてもう一度お願いします');
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
      setValue('image', base64);
    }
    reader.readAsDataURL(file);
    setImageURL(URL.createObjectURL(file));
  };

  const fetchFtProfile = async () => {
    const { data } = await axios.get('http://localhost:8080/user');
    if (data.isFtLogin) {
      setEmail(data.email);
      setValue('username', data.name);
      setValue('image', data.image);
      setImageURL(data.image);
    } else {
      throw new Error('42Authのみのサービスです');
    }
  }

  useEffect(() => {
    try {
      fetchFtProfile();
    } catch (error) {
      alert('プロフィール情報の取得に失敗しました。ブラウザをリフレッシュしてください');
    } finally {
      setLoading(false);
    }
  }, []);

  if (Loading) {
    return (
      <Box height={'100vh'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box height={'10vh'} width={'10vw'}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

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
                  return <FtUserProfileFormComponent email={email} control={control} setActiveStep={setActiveStep} errors={errors} isValid={isValid} />
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
  );
}
