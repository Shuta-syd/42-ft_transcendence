import { CircularProgress } from "@mui/material";
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
        }, 500);
      }
    };

    getUserAuth();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (!auth) {
    return <Navigate to={"/login"} replace />;
  }

  return children;
}
