import SignInForm from "../Components/signInForm";
import { Box } from "@mui/material";
import React from "react";
function LoginPage() {
  return (
    <div
      className="container-login"
      style={{
        backgroundImage: "url('/Assets/signin.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="signinLogo">
        <img src="/assets/TDG_logo_Black.webp" alt="Logo" />
      </h1>
      <Box className="login-form">
        <SignInForm />
      </Box>
    </div>
  );
}
export default LoginPage;
