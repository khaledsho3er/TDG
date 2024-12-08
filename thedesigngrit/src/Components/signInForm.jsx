// components/SignInForm.js
import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

function SignInForm() {
  return (
    <div>
      <h1 className="form-title-signin">
        Login
      </h1>
      <div className="signin-form">
        <button className="btn social-btn google-btn">
          <FcGoogle className="google-icon" />
          Continue with Google
        </button>
        <button className="btn social-btn facebook-btn">
          <FaFacebook className="facebook-icon" />
          Continue with Facebook
        </button>
        <div className="divider-signIn"> OR</div>
        <form>
          <input type="email" placeholder="E-mail" className="input-field" />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
          />
          <button type="submit" className="btn signin-btn">
            Sign In
          </button>
        </form>
        <p className="register-link">
          If you don’t have an account? <a href="/signup">Register</a>
        </p>
      </div>
    </div>
  );
}

export default SignInForm;
