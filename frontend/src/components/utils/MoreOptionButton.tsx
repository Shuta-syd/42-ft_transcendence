import React from "react";
import { Drawer, IconButton } from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

type MoreOptionButtonProps = {
  isOpen: boolean;
  setIsOpen: any; // useState set func
}

export default function MoreOptionButton(props: MoreOptionButtonProps) {
  const { isOpen, setIsOpen } = props;

  const handleOnOpen = () => {
    setIsOpen(true);
  }

  const handleOnClose = () => {
    setIsOpen(false);
  }

  return (
    <>
      <IconButton
        color="error"
        aria-label="open user list"
        onClick={handleOnOpen}
        >
        <MoreHorizIcon />
      </IconButton>
      <Drawer open={isOpen} onClick={handleOnClose}>
        <h1>TEST</h1>
        <h1>TEST</h1>
        <h1>TEST</h1>
        <h1>TEST</h1>
      </Drawer>
    </>
  )
}
