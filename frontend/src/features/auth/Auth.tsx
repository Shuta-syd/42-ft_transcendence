import React from "react";
import AuthComponent from "../../components/auth/AuthComponent";


function Auth(props: { type: string }) {
  return (
    <>
      <AuthComponent type={props.type} />
    </>
  )
}
export default Auth;
