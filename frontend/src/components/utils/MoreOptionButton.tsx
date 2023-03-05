import React from "react";
import { Drawer, IconButton } from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

type MoreOptionButtonProps = {
  isOpen: boolean;
  setIsOpen: any; // useState set func
  DrawerElement: any; // elements to drawer
  setGridWidth: any;
}

export default function MoreOptionButton(props: MoreOptionButtonProps) {
  const { isOpen, setIsOpen, DrawerElement, setGridWidth } = props;

  const handleOnOpen = () => {
    setGridWidth(`calc(100% - 18vw)`);
    setIsOpen(true);
  }

  const handleOnClose = () => {
    setGridWidth(`100%`);
    setIsOpen(false);
  }

  return (
    <>
      <IconButton
        color="error"
        edge='end'
        aria-label="open user list"
        onClick={handleOnOpen}
        >
        <MoreHorizIcon />
      </IconButton>
      <Drawer
        open={isOpen}
        onClick={handleOnClose}
        anchor="right"
        variant="persistent"
        sx={{
          '& .MuiDrawer-paper': {
            width: '18vw',
          },
        }}
      >
        { DrawerElement}
      </Drawer>
    </>
  )
}
