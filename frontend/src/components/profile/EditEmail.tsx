import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Box, TextField } from '@mui/material';
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

  const onSubmit = (data: FormData) => {
    console.log('Submitted:', data);
    reset({ email: '' });
  };

  /**
   * 自分の情報を取得する
   */

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
        width: '60%', // Adjust the width percentage to your desired size
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
            label={loginUser.email}
            type="email"
            placeholder="Please input new email"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        )}
      />
    </Box>
  );
};

export default EditEmail;
