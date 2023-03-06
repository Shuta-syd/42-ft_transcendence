import React from "react";
import { IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

export default function CustomPlusButton() {
  return (
    <>
      <IconButton
        color="error"
        aria-label="create channel"
        >
          <AddIcon />
      </IconButton>
    </>
  )
}
