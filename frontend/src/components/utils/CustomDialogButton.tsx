import React, { useState } from "react";
import { IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

type CustomDialogButtonProps = {
  DialogComponent: any;
  setChannels: any; // useState setter
}

/**
 * @returns MUIのDialogComponentを開くAddボタンコンポーネント
 */
export default function CustomDialogButton(props: CustomDialogButtonProps) {
  const { DialogComponent, setChannels } = props;
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
      <DialogComponent isOpen={isOpen} handleClose={handleClose} setChannels={setChannels} />
    </>
  )
}
