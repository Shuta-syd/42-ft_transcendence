/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import AddIcon from '@mui/icons-material/Add';
import CustomRadioGroup from "./CustomRadioGroup";

export default function CustomPlusButton() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setIsOpen(true);
  }

  const handleClose = () => {
    setIsOpen(false);
  }

  return (
    <>
      <IconButton
        color="error"
        aria-label="create channel"
        onClick={handleOpen}
        >
          <AddIcon />
      </IconButton>
      <Dialog open={isOpen} fullWidth>
        <DialogTitle>Create Channel</DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <TextField
            autoFocus
            fullWidth
            label="Channel Name"
            variant="standard"
            />
            <CustomRadioGroup />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Undo</Button>
          <Button>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
