import { IconButton, InputAdornment, TextField } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import React from "react";

type Props = {
  handleOnChange: any;
  handleOnClick: any;
  value: string;
}


function TextFieldComponent(props: Props) {
  const { handleOnChange, handleOnClick, value } = props;

  return (
    <div>
      <TextField fullWidth variant="outlined" placeholder="new message"
        style={{position: 'absolute', bottom: 0}}
        value={value}
        onChange={(e) => { handleOnChange(e.target.value) }}
        InputProps={{
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
