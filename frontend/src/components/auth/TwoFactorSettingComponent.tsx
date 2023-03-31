import { Box, Button, FormControlLabel, Stack, Switch, Typography } from "@mui/material";
import React, { useState } from "react";

type TwoFactorSettingComponentProps = {
  setActiveStep: any; // useState stepper
}

export default function TwoFactorSettingComponent(props: TwoFactorSettingComponentProps) {
  const { setActiveStep } = props;
  const [checked, setChecked] = useState(false);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  }

  return (
    <>
      <Stack spacing={2} alignItems="center">
        <Typography variant="body2">
          2段階認証を設定すると、アカウントのセキュリティが大幅に向上します。<br/>
          2段階認証の設定を推奨します。
        </Typography>
        <Typography variant="body2">
          Setting up two-step verification significantly increases the security of your account.<br/>
          we recommend setting up two-step verification.
        </Typography>
        <FormControlLabel control={<Switch onChange={handleOnChange} checked={checked}/>} label="2FA OFF / ON" />
      </Stack>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" onClick={() => setActiveStep(0)}>BACK</Button>
        <Button type='submit' variant="contained">Signup</Button>
      </Box>
    </>
  )
}
