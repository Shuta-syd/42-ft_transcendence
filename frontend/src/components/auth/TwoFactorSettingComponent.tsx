import { Box, Button, FormControlLabel, Stack, Switch, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TwoFactorDialog from "./TwoFactorDialog";


export default function TwoFactorSettingComponent() {
  const router = useNavigate();
  const [checked, setChecked] = useState(false); // trueのときdialog表示

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
        <Button variant="contained" onClick={() => {router('/user')}}>SKIP</Button>
      </Box>
      <TwoFactorDialog isOpen={checked} setIsOpen={setChecked}/>
    </>
  )
}
