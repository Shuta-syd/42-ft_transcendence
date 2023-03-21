import { Avatar, Box, Grid, Typography } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import axios from "axios";
import React, { useEffect, useState } from "react";
import InvitationButton from "../group/InvitationButton";
import CustomMenu from "../../utils/CustomMenu";

type MemberPayload = {
  id: string;
  name: string;
  isMute: boolean;
  userId: string;
  role: string;
}

type UserParticipantListProps = {
  roomId: string;
  isDM?: boolean;
}

export default function UserParticipantList(props: UserParticipantListProps) {
  const { roomId, isDM } = props;
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

  const getUserId = async ()=> {
    const { data } = await axios.get(`http://localhost:8080/user`);
    if (data){
      setUserId(data.id);
    }
  }

  useEffect(() => {
    getUserId();
    loadMember();
  }, [roomId])

  const handleKick = async (memberId: string) => {
    try {
      const res = await axios.delete(`http://localhost:8080/chat/channel/member/kick`, { data: { roomId, memberId } })
      const newMembers = members.filter(member => member.id !== memberId);
      setMembers(newMembers);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleBan = async (memberId: string) => {
    try {
      const res = await axios.post(`http://localhost:8080/chat/channel/member/ban`, { roomId, memberId });
      const newMembers = members.filter(member => member.id !== memberId);
      setMembers(newMembers);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleMute = async (memberId: string, isMute: boolean) => {
    try {
      const res = await axios.patch(`http://localhost:8080/chat/channel/mute`, { roomId, memberId, status: !isMute });
      setMembers(prev => prev.map(member => {
        if (member.id === memberId)
          return { ...member, isMute: !isMute };
        return member;
      }))
      console.log(res.data);
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <>
      {members.map((member, idx) => (
        <Grid
          key={idx}
          container
          height={'7vh'}
          justifyContent='space-between'
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Grid item>
            <Box>
              <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
                <Grid item mr={2}>
                  <Avatar ><PersonIcon /></Avatar>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1">
                    {member.name}
                  </Typography>
                  {member.userId === userId ?
                    (
                  <Typography variant="subtitle2">
                    You
                  </Typography>
                  ) : (<></>)
                  }
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item>
          {member.userId === userId || member.role !== 'NORMAL' ?
            (<></>) : (
              <CustomMenu
              ButtonIcon={<MoreVertIcon />}
              menuItems={[
                { name: member.isMute ? 'unMute' : 'Mute', handleOnClick: async () => { await handleMute(member.id, member.isMute) } },
                { name: 'Kick', handleOnClick: async () => { await handleKick(member.id) } },
                { name: 'Ban',  handleOnClick: async () => { await handleBan(member.id) } }
              ]}
              />
            )}
          </Grid>
        </Grid>
      ))}
      {
        isDM === true ? (<></>) : (
          <Box mt={2}>
            <InvitationButton roomId={roomId} setMembers={setMembers} members={members} />
          </Box>
        )
      }
    </>
  )
}
