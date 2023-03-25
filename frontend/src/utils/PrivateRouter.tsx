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
      } finally {
        setLoading(false);
      }
    };
    getUserAuth();
  }, []);

  if (loading) {
    return <></>;
  }

  if (!auth) {
    return <Navigate to={"/login"} replace />;
  }

  return children;
}
