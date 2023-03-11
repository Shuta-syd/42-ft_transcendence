/* eslint-disable no-unused-vars */
import { Dialog, Grid, IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import React, { useEffect, useState } from "react";
import axios from "axios";

type SearchChannelDialogProps = {
  isOpen: boolean;
  handleClose: any;
  setChannels: any; // useState setter
}

type SearchChannelType = {
  id: string;
  name: string;
  description?: string;
}

export default function SearchChannelDialog(props: SearchChannelDialogProps) {
  const { isOpen, handleClose, setChannels } = props;
  const [text, setText] = useState<string>('');
  const [searchResult, setSearchResult] = useState<SearchChannelType[]>([]);

  const handleOnChange = (value: string) => {
    setText(value);
  }

  useEffect(() => {
    const searchChannel = async () => {
      setSearchResult([]);
      const { data } = await axios.get(`http://localhost:8080/chat/channel/search`, {
        params: { name: text }
      });

      data.map((room: any) => {
        setSearchResult(prev => [...prev, { id: room.id, name: room.name }]);
      })
    }

    searchChannel();
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
        {searchResult.map((result: SearchChannelType, idx) => (
        <Grid container key={idx}>
          <Grid item >
            {result.name}
          </Grid>
        </Grid>
        ))}
      </Dialog>
    </>
  )
}
