import { Button } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import TwoFactorDialog from "../auth/TwoFactorDialog";

export default function TwoFactorButton() {
  const [is2faOn, setIs2faOn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  const get2fStatus = async () => {
    const { data } = await axios.get('http://localhost:8080/auth/otp/is');
    setIs2faOn(data);
  }

  useEffect(() => {
    try {
      get2fStatus();
    } catch (error) {
      alert('エラーが発生しました。リロードしてください')
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  }, []);

  const handle2faOff = async () => {
    const result = window.confirm('2FAを無効にしますか？');
    if (!result) return;
    await axios.patch('http://localhost:8080/auth/otp/off');
    setIs2faOn(false);
  }

  const handle2faOn = () => {
    setOpenDialog(true);
  }


  if (isLoading) return <></>;

  return (
    <>
      {
        is2faOn ? (
          <>
            <Button
              onClick={handle2faOff}
              variant="contained"
            >
              2FA OFF
            </Button>
          </>
        ) :
          (
            <>
              <Button
                onClick={handle2faOn}
                variant="contained"
              >
                2FA ON
              </Button>
              <TwoFactorDialog isOpen={openDialog} setIsOpen={setOpenDialog}/>
            </>
        )
      }
    </>
  )
}
