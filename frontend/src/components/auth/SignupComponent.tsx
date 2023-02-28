import { Button, Grid, TextField } from "@mui/material";
import React from "react";

function SignupComponent() {
  return (
    <Grid>
          <h2>Signup Component</h2>
          <TextField label="username" variant="outlined"/>
          <TextField label="email" variant="outlined"/>
          <TextField label="password" variant="outlined" />
          <Button variant="contained">SIGNUP</Button>
    </Grid>
  )
}

export default SignupComponent;
