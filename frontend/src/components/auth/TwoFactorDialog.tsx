/* eslint-disable no-unused-vars */
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useQRCode } from "next-qrcode";
import ClearIcon from '@mui/icons-material/Clear';
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

type TwoFactorDialogProps = {
  isOpen: boolean;
  setIsOpen: any; // useState setter
}

export default function TwoFactorDialog(props: TwoFactorDialogProps) {
  const { isOpen, setIsOpen } = props;
  const { Canvas } = useQRCode();
  const [qrCodeUrl, setQRCodeUrl] = useState('');
  const [otpcode, setOtpcode] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  const get2faQRCode = async () => {
    try {
      if (qrCodeUrl === '') {
        const { data } = await axios.post('http://localhost:8080/auth/otp');
        setQRCodeUrl(data);
      }
    } catch (error) {
      alert('2FA QRコード生成に失敗しました');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }

  useEffect(() => {
    get2faQRCode();
  }, []);

  const closeDialog = () => {
    setIsOpen(false);
    setOtpcode('');
  }

  const onConfirmButton = async () => {
    try {
      setLoadingConfirm(true);
      await axios.patch('http://localhost:8080/auth/otp/on');
      await axios.post('http://localhost:8080/auth/otp/validation', { otpcode });
      setIsAuth(true);
    } catch (error) {
      alert('ワンタイムパスワードが間違っています');
    } finally {
      setTimeout(() => {
        setLoadingConfirm(false);
      }, 500);
    }
  }

  if (isAuth) {
    return <Navigate to={"/user"} replace />;
  }

  return (
    <>
      <Dialog open={isOpen} fullWidth>
        <DialogTitle>
          <Box sx={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography fontSize={'1.5rem'}>
              QR Code
            </Typography>
            <DialogActions>
              <IconButton onClick={closeDialog}>
                <ClearIcon />
              </IconButton>
            </DialogActions>
          </Box>
        </DialogTitle>
        <Divider/>
        <DialogContent>
          <Stack spacing={2}>
            <Typography>1. Install 2FA app on your phone (ex. Google Authenticator)</Typography>
            <Typography>2. Scan the QR code below with your 2FA app</Typography>
            <Box>
              {loading ? (<CircularProgress />) : (
                <>
                  <Canvas
                    text={qrCodeUrl}
                    />
                </>
              )
              }
            </Box>
            <Typography>3. Enter the 6-digit code from your 2FA app</Typography>
            <TextField
              value={otpcode}
              onChange={(e) => { setOtpcode(e.target.value) }}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button variant="contained" onClick={onConfirmButton} sx={{ width: '5rem', height: '2.5rem' }}>
                      {loadingConfirm ? (
                        <Box sx={{ color: 'white', display: 'flex', alignItems: 'center'}} >
                          <CircularProgress color="inherit" size={30}/>
                        </Box>
                      ) : (
                        <>Confirm</>
                      )}
                    </Button>
                  </InputAdornment>
                )
              }}
            />
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  )
}
