import { IconButton, InputAdornment, TextField } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import React from "react";

type TextFieldComponentProps = {
  textFieldWidth?: string ;
  handleOnChange: any;
  handleOnClick: any;
  value: string;
}


function TextFieldComponent(props: TextFieldComponentProps) {
  const { handleOnChange, handleOnClick, value, textFieldWidth } = props;

  return (
    <div>
      <TextField
        type={"text"}
        variant="outlined"
        placeholder="new message"
        style={{ position: 'absolute', bottom: 0 }}
        value={value}
        onChange={(e) => { handleOnChange(e.target.value) }}
        sx={{
          width: textFieldWidth === undefined ? '100%' : textFieldWidth,
          '& .MuiInputBase-root': {
            border: '2px solid #787A91',
            overflow: 'hidden',
            borderRadius: 2,
          }
        }}
        InputProps={{
          style: { color: '#EEEEEE' },
          startAdornment: (
            <InputAdornment position="start">
              <IconButton color="primary">
                <AddCircleIcon fontSize="medium"/>
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton color="primary" onClick={handleOnClick}>
                <SendIcon/>
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    </div>
  )
}

export default TextFieldComponent;
