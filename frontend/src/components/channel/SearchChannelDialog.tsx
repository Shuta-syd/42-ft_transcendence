/* eslint-disable no-unused-vars */
import { Button, Dialog, Grid, IconButton, InputAdornment, Menu, MenuItem, TextField } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import KeyIcon from '@mui/icons-material/Key';
import SearchIcon from '@mui/icons-material/Search';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@mui/system";

type SearchChannelDialogProps = {
  isOpen: boolean;
  handleClose: any;
  setChannels: any; // useState setter
}

type SearchChannelType = {
  id: string;
  name: string;
  type: string;
  description?: string;
}

export default function SearchChannelDialog(props: SearchChannelDialogProps) {
  const { isOpen, handleClose, setChannels } = props;
  const [text, setText] = useState<string>('');
  const [pass, setPass] = useState<string>('');
  const [searchResult, setSearchResult] = useState<SearchChannelType[]>([]);



  useEffect(() => {
    const searchChannel = async () => {
      const { data } = await axios.get(`http://localhost:8080/chat/channel/search`, {
        params: { name: text }
      });
      if (data.length === searchResult.length)
        return ;
      setSearchResult([]);
      data.map((room: any) => {
        setSearchResult(prev => [...prev, { id: room.id, name: room.name, type: room.type}]);
      })
    }

    searchChannel();
  }, [text]);

  const handleOnChange = (value: string) => {
    setText(value);
  }

  const handleOnClick = async (roomId: string, password?: string) => {
    try {
      setPass('');
      const { data } = await axios.post(`http://localhost:8080/chat/member/add/me`, { roomId, status: 'NORMAL', password });
      setChannels((prev: any) => [...prev, { name: data.name, id: data.id }]);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Dialog
        fullWidth
        open={isOpen}
        onClose={handleClose}
      >
        <Box sx={{ position: 'relative', height:'40vh'}}>
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
          {searchResult.length > 0 ? (
            <Box sx={{ position: 'absolute', left: 0, right: 0 }}>
              {searchResult.map((channel: SearchChannelType, idx) => (
                <Grid
                  key={idx}
                  container
                  height={'5vh'}
                  border={1}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Grid item>
                    {channel.name}
                  </Grid>
                  <Grid item>
                    {channel.type === 'PROTECT' ?
                      (
                        <LockIcon/>
                      ) : (<></>)}
                  </Grid>
                  <Grid item>
                    {
                      channel.type === 'PROTECT' ?
                        (
                          <>
                            <TextField
                              size="small"
                              label={'password'}
                              value={pass}
                              onChange={e => { setPass(e.target.value); }}
                              />
                            <Button
                              onClick={async () => { await handleOnClick(channel.id, pass); }}
                              >
                              JOIN
                            </Button>
                          </>
                        ) : (
                    <Button
                      onClick={async (event) => { await handleOnClick(channel.id); }}
                    >
                      JOIN
                    </Button>
                        )
                    }
                  </Grid>
                </Grid>
              ))}
            </Box>
          ) : null}
        </Box>
      </Dialog>
    </>
  )
}