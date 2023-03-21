import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import UserParticipantList from "./UserParticipantsList";

type UserParticipantsComponentProps = {
  roomId: string;
  isDM?: boolean;
}

export default function UserParticipantsComponent(props: UserParticipantsComponentProps) {
  const { roomId } = props;

  return (
    <Grid item xs={2.5}>
      <Grid
        container
        justifyContent={'center'}
        height={'7vh'}
      >
        <Box
            width={'90%'}
            borderBottom={2}
            borderColor={'#EDF0F4'}
            textAlign={'left'}
            sx={{ display: 'flex', alignItems: 'center' }}
            >
            <Typography
              variant="h5"
              ml={2}
              sx={{ color: '#3C444B' }}
            >
              User Participants
            </Typography>
        </Box>
        <Box width={'90%'}>
          <UserParticipantList roomId={roomId} isDM={props.isDM} />
        </Box>
      </Grid>
    </Grid>
  )
}
