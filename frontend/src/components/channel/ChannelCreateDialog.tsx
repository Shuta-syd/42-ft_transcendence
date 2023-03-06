import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import CustomRadioGroup from "../utils/CustomRadioGroup";

type ChannelCreateDialogProps = {
  isOpen: boolean;
  handleClose: any;
}

export default function ChannelCreateDialog(props: ChannelCreateDialogProps) {
  const { isOpen, handleClose } = props;
  return (
    <>
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
            <CustomRadioGroup label="Channel Create" fromControlLabels={["PUBLIC", "PROTECTED", "PRIVATE"]}/>
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
