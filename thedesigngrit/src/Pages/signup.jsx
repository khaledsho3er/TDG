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
        <img
          src="https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/TDG_Icon_Black.webp"
          alt="Logo"
        />
      </h1>
      <div className="signup-form-container">
        <SignUpForm />
      </div>
    </div>
  );
}
export default SignUpPage;
