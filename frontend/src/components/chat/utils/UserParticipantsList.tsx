import { Avatar, Box, CircularProgress, Grid, Typography } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import React, {useEffect, useState } from "react";
import InvitationButton from "../group/InvitationButton";
import AdminButton from "./AdminButton";

type MemberPayload = {
  id: string;
  name: string;
  isMute: boolean;
  userId: string;
  image: string;
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
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserId = async () => {
      const { data } = await axios.get(`http://localhost:8080/user`);
      if (data){
        setUserId(data.id);
      }
    }

    getUserId();
  }, [roomId]);

  useEffect(() => {
    const loadMember = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:8080/chat/room/${roomId}`);
        if (data.members) {
          const newMembers: MemberPayload[] = data.members.map((member: any) => ({
            id: member.id,
            name: member.user.name,
            isMute: member.isMute,
            userId: member.user.id,
            image: member.user.image,
            role: member.role
          }));
          setMembers(newMembers);
          const myMember = data.members.find((member: any) => member.userId === userId);
          if (myMember) {
            setMyRole(myMember.role);
          }
        }
      } catch (error) {
        alert('メンバーが正しく取得できませんでした。ブラウザをリフレッシュしてください');
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 200);
      }
    }

    loadMember();
  }, [roomId, userId]);

  if (Loading) {
    return (
      <>
        <Box height={'5rem'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress/>
        </Box>
      </>
    )
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
                  <Link to={`/user/${member.userId}`}>
                    <Avatar src={`${member.image}`} />
                  </Link>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1">
                    <Link to={`/user/${member.userId}`} className={'UserParticipantLink'}>
                      {member.name}
                    </Link>
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
            <AdminButton
              roomId={roomId}
              myRole={myRole}
              memberRole={member.role}
              member={member}
              members={members}
              setMembers={setMembers}
            />
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
