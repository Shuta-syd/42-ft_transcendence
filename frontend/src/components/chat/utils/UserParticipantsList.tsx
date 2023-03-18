import { Avatar, Box, Grid, Typography } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import axios from "axios";
import React, { useEffect, useState } from "react";
import InvitationButton from "../group/InvitationButton";
import AdminButton from "./AdminButton";

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
  const [myRole, setMyRole] = useState<string>('');
  const [members, setMembers] = useState<MemberPayload[]>([]);

  const loadMember = async () => {
    await getUserId();

    setMembers([]);
    const { data } = await axios.get(`http://localhost:8080/chat/room/${roomId}`);
    if (data.members) {
      data.members.map((member: any) => {
        const newMember: MemberPayload = {
          id: member.id, name: member.user.name, isMute: member.isMute,
          userId: member.user.id, role: member.role
        };
        setMembers(prevMembers => [...prevMembers, newMember]);
        if (member.userId === userId) setMyRole(member.role);
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
    loadMember();
  }, [roomId])

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
            {myRole !== 'NORMAL' ? (
              <AdminButton
                roomId={roomId}
                myRole={myRole}
                memberRole={member.role}
                member={member}
                members={members}
                setMembers={setMembers}
              />
            ) : (<></>)}
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
