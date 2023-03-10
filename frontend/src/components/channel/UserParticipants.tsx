import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import axios from "axios";
import React, { useEffect, useState } from "react";
import InvitationButton from "./InvitationButton";

type MemberPayload = {
  id: string;
  name: string;
  isMute: boolean;
  userId: string;
  role: string;
}

type UserParticipantProps = {
  roomId: string;
}

export default function UserParticipant(props: UserParticipantProps) {
  const { roomId } = props;
  const [userId, setUserId] = useState<string>();
  const [members, setMembers] = useState<MemberPayload[]>([]);

  const loadMember = async () => {
    setMembers([]);
    const { data } = await axios.get(`http://localhost:8080/chat/room/${roomId}`);
    if (data.members) {
      data.members.map((member: any) => {
        const newMember: MemberPayload = {
          id: member.id, name: member.user.name, isMute: member.isMute,
          userId: member.user.id, role: member.role
        };
        setMembers(prevMembers => [...prevMembers, newMember]);
      })
    }
  }

  const getUserId = async () => {
    const { data } = await axios.get(`http://localhost:8080/user`);
    if (data){
      setUserId(data.id);
    }
  }

  useEffect(() => {
    loadMember();
    getUserId();
  }, [roomId])

  const handleKick = async () => {
    console.log('Kick button');
  }

  const handleMute = async (memberId: string, isMute: boolean) => {
    try {
      const res = await axios.patch(`http://localhost:8080/chat/channel/mute`, { roomId, memberId, status: !isMute });
      await loadMember();
      console.log(res.data);
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <Box>
      <Typography
        borderBottom={2.5}
        variant="h6"
        padding={0.5}
        sx={{ fontFamily: 'Lato', color: '#EEEEEE', fontWeight: 700 }}
      >
      @ Participants
      </Typography>
      {members.map((member, idx) => (
        <Grid container padding={1} key={idx}>
          <Grid item xs={5}>
            <Grid container>
              <Grid item mr={2}>
                <Avatar ><PersonIcon /></Avatar>
              </Grid>
              <Grid item>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#EEEEEE' }} >
                  {member.name}
                </Typography>
                {member.userId === userId ? (
                  <Typography variant="subtitle2" sx={{ fontWeight: 500, color: '#EEEEEE' }} >
                    You
                  </Typography>
                ) : (<></>)}
              </Grid>
            </Grid>
          </Grid>
          {member.userId === userId || member.role !== 'NORMAL' ?
            (<></>) : (
              <Grid item>
                <Button variant="contained" size="small" onClick={handleKick}>Kick</Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={async () => { await handleMute(member.id, member.isMute); }}
                >
                  {member.isMute ? 'unMute' : 'Mute'}
                </Button>
              </Grid>
            )}
        </Grid>
      ))}
      <InvitationButton />
    </Box>
  )
}
