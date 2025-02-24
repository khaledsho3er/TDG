import React from "react";
import "../App.css";
import SignUpForm from "../Components/signUpForm";
function SignUpPage() {
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
        <img src="/Assets/TDG_logo_Black.png" alt="Logo" />
      </h1>
      <div className="signup-form-container">
        <SignUpForm />
      </div>
    </div>
  );
}
export default SignUpPage;
