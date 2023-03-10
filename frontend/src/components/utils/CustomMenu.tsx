import { IconButton, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";

type CustomMenuProps = {
  ButtonIcon: any;
  menuItems: {
    name: string;
    handleOnClick: any;
  }[];
}

export default function CustomMenu(props: CustomMenuProps) {
  const { ButtonIcon, menuItems } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }

  return (
    <>
      <IconButton
        color="error"
        aria-label="create channel"
        onClick={handleOpen}
        >
        { ButtonIcon }
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClick={() => { setAnchorEl(null); }}
      >
        {menuItems.map((item, idx) => (
          <MenuItem onClick={() => { setAnchorEl(null); item.handleOnClick(); }} key={idx}>
            {item.name}
          </MenuItem>
        ))
        }
      </Menu>
    </>
  )
}
