import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { Box, Button, TextField, Typography } from '@mui/material';
import { fetchProfileUser } from '../../hooks/profile/useProfileUser';
import { User } from '../../types/PrismaType';

type FormData = {
  email: string;
};

type IsFtloginProps = {
  isFtlogin: boolean | undefined;
};

const EditEmail = (props: IsFtloginProps) => {
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
        setErrorMessage('');
        reset({ email: '' });
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
        alert(
          `メールアドレスの変更中にエラーが発生しました: ${
            (error as Error).message
          }`,
        );
        setErrorMessage('This email has already been used.');
      });
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
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%',
        margin: '0px',
      }}
      >
      {!props.isFtlogin &&
        <Box
          sx={{
            width: '60%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '5px',
            padding: '0px',
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
                disabled={props.isFtlogin}
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
      }
      {!props.isFtlogin &&
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            marginLeft: '0px',
            height: '100%',
            minHeight: 'inherit',
          }}
        >
          Enter
        </Button>
      }
    </Box>
  );
};

export default EditEmail;
