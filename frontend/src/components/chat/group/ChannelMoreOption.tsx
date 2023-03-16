import React, { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import CustomMenu from "../../utils/CustomMenu";
import ChannelCreateDialog from "./ChannelCreateDialog";
import SearchChannelDialog from "../utils/SearchChannelDialog";

type ChannelMoreOptionProps = {
  setChannels: any; // useState setter
}

/**
 * @returns MUIのDialogComponentを開くAddボタンコンポーネント
 */
export default function ChannelMoreOption(props: ChannelMoreOptionProps) {
  const { setChannels } = props;
  const [createChannelDialogIsOpen, setCreateChannelDialogIsOpen] = useState<boolean>(false);
  const [searchChannelDialogIsOpen, setSearchChannelDialogIsOpen] = useState<boolean>(false);


  const handleOpenCreateChannel = () => {
    setCreateChannelDialogIsOpen(true);
  }

  const handleCloseCreateChanel = () => {
    setCreateChannelDialogIsOpen(false);
  }

  const handleOpenSearchChannel = () => {
    setSearchChannelDialogIsOpen(true);
  }

  const handleCloseSearchChanel = () => {
    setSearchChannelDialogIsOpen(false);
  }

  return (
    <>
      <CustomMenu
        ButtonIcon={<AddIcon/>}
        menuItems={[
          { name: 'Create Channel', handleOnClick: handleOpenCreateChannel },
          { name: 'Search Channel', handleOnClick: handleOpenSearchChannel},
        ]}
      />
      <ChannelCreateDialog isOpen={createChannelDialogIsOpen} handleClose={handleCloseCreateChanel} setChannels={setChannels} />
      <SearchChannelDialog isOpen={searchChannelDialogIsOpen} handleClose={handleCloseSearchChanel} setChannels={setChannels} />
    </>
  )
}
