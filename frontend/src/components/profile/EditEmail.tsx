import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { Box, TextField, Typography } from '@mui/material';
import { fetchProfileUser } from '../../hooks/profile/useProfileUser';
import { User } from '../../types/PrismaType';

type FormData = {
  email: string;
};

const EditEmail = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const [loginUser, setLoginUser] = useState<User>({} as User);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onSubmit = (data: FormData) => {
    console.log('Submitted:', data);

    axios
      .post<User>(`http://localhost:8080/user/add/email`, {
        email: data.email,
      })
      .then((res) => {
        console.log(res);
        console.log(res.data);
        setLoginUser(res.data);
        setErrorMessage(''); // 成功した場合、エラーメッセージをクリアする
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage('This email has already been used.');
      });

    reset({ email: '' });
  };

  useEffect(() => {
    const UserPromises = fetchProfileUser();
    UserPromises.then((userDto: User) => {
      setLoginUser(userDto);
    });
  }, []);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: '30%',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '5px',
        padding: '20px',
      }}
    >
      <Controller
        name={`email`}
        control={control}
        defaultValue={loginUser.email || ''}
        rules={{
          required: 'Email address is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
            message: 'Please enter a valid email address format.',
          },
        }}
        render={({ field }) => (
          <TextField
            required
            fullWidth
            {...field}
            label="Edit Email"
            type="email"
            placeholder={loginUser.email}
            error={!!errors.email || !!errorMessage}
            helperText={errors.email?.message}
          />
        )}
      />
      {errorMessage && (
        <Typography variant="body2" color="error" sx={{ marginTop: '8px' }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
};

export default EditEmail;
