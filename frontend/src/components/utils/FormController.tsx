import { TextField } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";
import { FromControllerProps } from "./type/FormController";

function FormController(props: FromControllerProps) {
  const { name, control, placeholder } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={(
        { field }
      ) => (
        <TextField
          label={field.name}
          placeholder={placeholder}
          value={field.value}
          onChange={field.onChange}
        />
      )}
    />
  )
}

export default FormController;
