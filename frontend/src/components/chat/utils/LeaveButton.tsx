import { IconButton } from "@mui/material";
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import React from "react";

export default function LeaveButton() {
  const handleOnClick = () => {

  }

  return (
    <>
      <IconButton
        sx={{ color: '#fb5c59' }}
        onClick={handleOnClick}
      >
        <HighlightOffOutlinedIcon/>
      </IconButton>
    </>
  )
}
