import { IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import React, { useState } from "react";
import SearchFriendDialog from "./SearchFriendDialog";

type CreateDMRoomButtonProps = {
  setDMRooms: any // useState setter
}

/**
 * @returns フレンドのDMRoomを作成するプラスボタンコンポーネント
 */
export default function CreateDMRoomButton(props: CreateDMRoomButtonProps) {
  const { setDMRooms } = props;
  const [createDMDialogIsOpen, setCreateDMDialogIsOpen] = useState<boolean>(false);


  const handleOpenSearchFriend = () => {
    setCreateDMDialogIsOpen(true);
  }

  const handleCloseSearchFriend = () => {
    setCreateDMDialogIsOpen(false);
  }

  return (
    <>
      <IconButton
        sx={{ color: '#B2B9C5' }}
        onClick={handleOpenSearchFriend}
      >
        <AddIcon />
      </IconButton>
      <SearchFriendDialog setDMRooms={setDMRooms} handleClose={handleCloseSearchFriend} isOpen={createDMDialogIsOpen} />
    </>
  )
}
