import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TextField } from '@mui/material';

type FormData = {
  email: string;
};

const EditEmail = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log('Submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={control}
        defaultValue=""
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
            label="email"
            type="email"
            placeholder="Please input new email"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        )}
      />
    </form>
  );
};

export default EditEmail;
