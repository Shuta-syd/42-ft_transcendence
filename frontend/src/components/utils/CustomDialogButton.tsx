import React, { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import CustomMenu from "./CustomMenu";

type CustomDialogButtonProps = {
  DialogComponent: any;
  setChannels: any; // useState setter
}

/**
 * @returns MUIのDialogComponentを開くAddボタンコンポーネント
 */
export default function CustomDialogButton(props: CustomDialogButtonProps) {
  const { DialogComponent, setChannels } = props;
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);


  const handleOpenDialog = () => {
    setDialogIsOpen(true);
  }

  const handleCloseDialog = () => {
    setDialogIsOpen(false);
  }

  return (
    <>
      <CustomMenu
        ButtonIcon={<AddIcon/>}
        menuItems={[{ name: 'Create Channel', handleOnClick: handleOpenDialog}]}
      />
      <DialogComponent isOpen={dialogIsOpen} handleClose={handleCloseDialog} setChannels={setChannels} />
    </>
  )
}
