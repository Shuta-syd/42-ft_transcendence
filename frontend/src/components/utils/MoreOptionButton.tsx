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

  const handleOnClick = () => {
    if (isOpen === false) {
      setGridWidth(`calc(100% - 18vw)`);
      setIsOpen(true);
    } else {
      setGridWidth(`100%`);
      setIsOpen(false);
    }
  }

  return (
    <>
      <IconButton
        color="error"
        edge='end'
        aria-label="open user list"
        onClick={handleOnClick}
        >
        <MoreHorizIcon />
      </IconButton>
      <Drawer
        open={isOpen}
        anchor="right"
        variant="persistent"
        sx={{
          '& .MuiDrawer-paper': {
            top: '6vh',
            width: '18vw',
            background: '#141E61',
          },
        }}
      >
        { DrawerElement}
      </Drawer>
    </>
  )
}
