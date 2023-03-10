import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }

  const handleCloseDialog = () => {
    setDialogIsOpen(false);
  }

  return (
    <>
      <IconButton
        id="basic-button"
        color="error"
        aria-label="create channel"
        onClick={handleOpen}
        >
          <AddIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClick={() => { setAnchorEl(null); }}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => { setDialogIsOpen(true); setAnchorEl(null); }}>
          Create Channel
        </MenuItem>
      </Menu>
      <DialogComponent isOpen={dialogIsOpen} handleClose={handleCloseDialog} setChannels={setChannels} />
    </>
  )
}
