/* eslint-disable no-unused-vars */
import { Button, Dialog, Grid, IconButton, InputAdornment, TextField } from "@mui/material";
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
  const [userId, setUserId] = useState<string>();
  const [searchResult, setSearchResult] = useState<SearchChannelType[]>([]);

  const handleOnChange = (value: string) => {
    setText(value);
  }

  const getUserId = async () => {
    const { data } = await axios.get(`http://localhost:8080/user`);
    if (data){
      setUserId(data.id);
    }
  }


  useEffect(() => {
    const searchChannel = async () => {
      setSearchResult([]);
      const { data } = await axios.get(`http://localhost:8080/chat/channel/search`, {
        params: { name: text }
      });

      data.map((room: any) => {
        setSearchResult(prev => [...prev, { id: room.id, name: room.name}]);
      })
    }

    searchChannel();
  }, [text]);

  const handleOnClick = async (roomId: string) => {
    await axios.post(`http://localhost:8080/chat/member/add/me`, { roomId, status: 'NORMAL' });
    console.log('you join');
  }

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
          <Grid
            key={idx}
            container
            height={'5vh'}
            border={1}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
          <Grid item>
            {result.name}
          </Grid>
          <Grid item>
            <Button onClick={async () => {await handleOnClick(result.id)}}>
                JOIN
            </Button>
          </Grid>
        </Grid>
        ))}
      </Dialog>
    </>
  )
}
