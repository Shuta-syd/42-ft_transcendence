import { IconButton } from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import React from "react";

type OptionOpenButtonProps = {
  open: boolean;
  setOpen: any; // useState setter <boolean>
}

export default function OptionOpenButton(props: OptionOpenButtonProps) {
  const { open, setOpen } = props;

  const handleOnClick = () => {
    open ? setOpen(false) : setOpen(true);
  }

  return (
    <>
      <IconButton
        sx={{ color: '#B2B9C5' }}
        onClick={handleOnClick}
      >
        <MoreHorizIcon />
      </IconButton>
    </>
  )
}
