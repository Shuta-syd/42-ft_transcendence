/* eslint-disable no-unused-vars */
import { Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useQRCode } from "next-qrcode";
import ClearIcon from '@mui/icons-material/Clear';
import React, { useEffect, useState } from "react";

type TwoFactorDialogProps = {
  isOpen: boolean;
  setIsOpen: any; // useState setter
}

export default function TwoFactorDialog(props: TwoFactorDialogProps) {
  const { isOpen, setIsOpen } = props;
  const { Canvas } = useQRCode();
  const [qrCodeUrl, setQRCodeUrl] = useState('');
  const [loading, setLoading] = useState(true);

  const get2faQRCode = async () => {
    try {
      const { data } = await axios.post('http://localhost:8080/auth/otp');
      setQRCodeUrl(data);
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
  }, [isOpen]);

  const closeDialog = () => {
    setIsOpen(false);
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
            <TextField fullWidth/>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  )
}
