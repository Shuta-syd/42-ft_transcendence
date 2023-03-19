/* eslint-disable no-unused-vars */
import { Box, Button, Dialog, Grid, IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import React, { useEffect, useState } from "react";
import axios from "axios";

type SearchFriendDialogProps = {
  isOpen: boolean;
  handleClose: any;
  setDMRooms: any; // useState setter
}

type SearchFriendType = {
  id: string;
  name: string;
}

export default function SearchFriendDialog(props: SearchFriendDialogProps) {
  const { isOpen, handleClose, setDMRooms } = props;
  const [text, setText] = useState<string>('');
  const [searchResult, setSearchResult] = useState<SearchFriendType[]>([]);

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
      const { data } = await axios.post(`http://localhost:8080/chat/member/add/me`, { roomId, status: 'NORMAL', password });
      setDMRooms((prev: any) => [...prev, { name: data.name, id: data.id }]);
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
        <Box>
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
              {searchResult.map((friend: SearchFriendType, idx) => (
                <Grid
                  key={idx}
                  container
                  height={'5vh'}
                  border={1}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Grid item>
                    {friend.name}
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={async (event) => { await handleOnClick(friend.id); }}
                    >
                      JOIN
                    </Button>
                  </Grid>
                </Grid>
              ))}
            </Box>
          ) : null}
        </Box>
      </Dialog>
    </>
  );
}
