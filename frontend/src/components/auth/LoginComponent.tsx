import { Box, Grid } from "@mui/material";
import React from "react";

function LoginComponent() {

  return (
    <Box width={'40rem'}>
      <Box
        height={'5rem'}
        border={2}
        borderRadius={'5px'}
        borderColor={'#e0e3e9'}
        mt={'3rem'}
        mb={'3rem'}
      >
        Title
      </Box>
      <Grid
        container
        height={'30rem'}
        border={2}
        borderRadius={'5px'}
        borderColor={'#e0e3e9'}
      >
        <Grid item>
          Login Children
        </Grid>
      </Grid>
    </Box>
  )
}

export default LoginComponent;
