/* eslint-disable no-unused-vars */
import { Dialog, IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import React, { useEffect, useState } from "react";

type SearchChannelDialogProps = {
  isOpen: boolean;
  handleClose: any;
  setChannels: any; // useState setter
}

export default function SearchChannelDialog(props: SearchChannelDialogProps) {
  const { isOpen, handleClose, setChannels } = props;
  const [text, setText] = useState<string>('');
  const [searchResult, setSearchResult] = useState([]);

  const handleOnChange = (value: string) => {
    setText(value);
  }

  useEffect(() => {
    const searchChannel = async () => {

    }
  }, [text]);

  return (
    <>
      <Dialog
        fullWidth
        open={isOpen}
        onClose={handleClose}
      >
        <TextField
          fullWidth
          autoFocus
          value={text}
          variant="outlined"
          onChange={(e) => { handleOnChange(e.target.value) }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton color="primary">
                  <SearchIcon fontSize="medium"/>
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Dialog>
    </>
  )
}
