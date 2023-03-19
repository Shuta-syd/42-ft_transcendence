/* eslint-disable no-unused-vars */
import { Box, Button, Dialog, Grid, IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const router = useNavigate();
  const [text, setText] = useState<string>('');
  const [searchResult, setSearchResult] = useState<SearchFriendType[]>([]);

  useEffect(() => {
    const searchChannel = async () => {
      const { data } = await axios.get(`http://localhost:8080/user/friend/search`, {
        params: { name: text }
      });
      if (data.length === searchResult.length)
        return ;
      setSearchResult([]);
      data.map((friend: any) => {
        setSearchResult(prev => [...prev, { id: friend.id, name: friend.name}]);
      })
    }

    searchChannel();
  }, [text]);

  const handleOnChange = (value: string) => {
    setText(value);
  }

  const handleOnClick = async (friendId: string, friendName: string) => {
    try {
      const { data } = await axios.post(`http://localhost:8080/chat/dm/room`, {
        type: 'DM',
        name: '',
        friendId,
      });
      handleClose();
      router(`${data.room.id}`);
      if (data.isNew)
        setDMRooms((prev: any) => [...prev, { name: friendName, id: data.room.id }]);
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
              {searchResult.map((friend: SearchFriendType, idx) => (
                <Grid
                  key={idx}
                  container
                  height={'5vh'}
                  borderBottom={1}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Grid item>
                    {friend.name}
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={async (event) => { await handleOnClick(friend.id, friend.name); }}
                    >
                      Join
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
