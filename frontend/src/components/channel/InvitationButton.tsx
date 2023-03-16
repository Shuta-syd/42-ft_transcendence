import styled from "@emotion/styled";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import PersonIcon from '@mui/icons-material/Person';
import axios from "axios";
import React, { useEffect, useState } from "react";

type InvitationButtonProps = {
  roomId: string;
  setMembers: any; // useState setter
  members: any; // useState value
}

type FriendPayload = {
  id: string;
  name: string;
}

const CustomButton = styled(Button)({
  fontSize: 16,
  fontFamily: ['Lato', 'sans-serif'],
  backgroundColor: '#1f9f88',
  color: '#EDF0F4',
  height: '4vh',
  '&:hover': {
    backgroundColor: '#1f9f88'
  },
});

export default function InvitationButton(props: InvitationButtonProps) {
  const { roomId,setMembers, members } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [myFriends, setMyFriends] = useState<FriendPayload[]>([]);

  const getMyFriends = async () => {
    const { data } = await axios.get(`http://localhost:8080/user/friend`);
    data.map((friend: any) => {
      setMyFriends(prev => [...prev, { id: friend.id, name: friend.name }]);
    })
  }

  useEffect(() => {
    setMyFriends([]);
    getMyFriends();
  }, [roomId])

  const handleOpen = () => {
    setIsOpen(true);
  }

  const handleClose = () => {
    setIsOpen(false);
  }

  const handleInvite = async (friendId: string) => {
    const { data } = await axios.post(`http://localhost:8080/chat/member/add`, { userId: friendId, roomId, status: 'NORMAL' });
    const newMember = {
      id: data.id,
      name: data.user.name,
      isMute: data.isMute,
      userId: data.userId,
      role: data.role,
    };
    setMembers((prev: any) => [...prev, newMember]);
  }

  return (
    <>
      <CustomButton fullWidth variant="contained" onClick={handleOpen}>
        Invite your friend
      </CustomButton>
      <Dialog open={isOpen}>
        <DialogTitle>Your Friends List</DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            {myFriends.map((friend: FriendPayload, idx) => (
              <Grid key={idx} container sx={{ display: 'flex', alignItems: 'center' }}>
                <Grid item mr={1}>
                  <Avatar ><PersonIcon /></Avatar>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1" sx={{fontWeight: 700}} >{friend.name}</Typography>
                </Grid>
                <Grid item>
                  {members.find((member: any) => member.userId === friend.id) ? (
                    <Button disabled>Invited</Button>
                  ) : (
                    <Button onClick={() => handleInvite(friend.id)}>Invite</Button>
                  )}
                </Grid>
              </Grid>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
