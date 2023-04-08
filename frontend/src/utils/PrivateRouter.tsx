import { Box, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import userAuth from "./userAuth";

// eslint-disable-next-line no-undef
export default function PrivateRouter({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const getUserAuth = async () => {
      try {
        const isAuth = await userAuth();
        setAuth(isAuth);
      } catch {
        alert('ログインしください');
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    getUserAuth();
  }, []);

  if (loading) {
    return (
      <Box height={'100vh'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box height={'10vh'} width={'10vw'}>
          <CircularProgress/>
        </Box>
      </Box>
    );
  }

  if (!auth) {
    return <Navigate to={"/login"} replace />;
  }

  return children;
}
