import React from "react";
import AuthComponent from "../../components/auth/AuthComponent";


function Auth(props: { isLogin: boolean }) {
  return (
    <>
      <AuthComponent isLogin={props.isLogin} />
    </>
  )
}
export default Auth;
