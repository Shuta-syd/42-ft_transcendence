import React from "react";
import { Navigate } from "react-router-dom";

// eslint-disable-next-line no-undef
export default function PrivateRouter({ children }: { children: JSX.Element }) {
  const auth = false;
  if (!auth) alert('ログインしてください');

  return auth ? children : <Navigate to={"/login"} replace/>
}
