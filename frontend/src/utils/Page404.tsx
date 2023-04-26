import React from "react"
import { Link } from "react-router-dom"

export default function Page404() {
  return (
    <div>
      <h1>404 Page Not Found</h1>
      <Link to={'/login'}>To Login</Link>
      <br/>
      <Link to={'/signup'}>To Signup</Link>
    </div>
  )
}
