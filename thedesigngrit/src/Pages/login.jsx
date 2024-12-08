import SignInForm from "../Components/signInForm";
import { Box } from "@mui/material";
import React from "react";
function LoginPage() {
  return (
    <div className="container-login">
       <h1 className="signinLogo">
        <img src="Assets/TDG_logo_Black.png" alt="Logo" />
      </h1>
      <Box className="login-form">
        <SignInForm />
        </Box>
    </div>
  );
}
export default LoginPage;
