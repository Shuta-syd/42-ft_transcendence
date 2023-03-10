import styled from "@emotion/styled";
import { Button } from "@mui/material";
import React from "react";

const CustomButton = styled(Button)({
  fontSize: 16,
  fontFamily: ['Lato', 'sans-serif'],
  backgroundColor: '#0F044C',
  color: '#EEEEEE',
  height: '4vh',
  '&:hover': {
    backgroundColor: '#0F044C'
  },
});

export default function InvitationButton() {
  return (
    <CustomButton fullWidth variant="contained">
      Invite your friend
    </CustomButton>
  )
}
