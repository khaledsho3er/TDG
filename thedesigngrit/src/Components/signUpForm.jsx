// components/SignUpForm.js
import React from "react";
import { Checkbox } from "@mui/material";
function SignUpForm() {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  return (
    <div>
      <div className="signup-logo">
        <img src="Assets/TDG_logo_Black.png" alt="Logo" />
      </div>
      <div className="signup-form">
        <form>
          <input type="email" placeholder="E-mail" className="input-field" />
          <input type="Text" placeholder="First Name" className="input-field" />

          <input type="Text" placeholder="Last Name" className="input-field" />

          <input
            type="password"
            placeholder="Password"
            className="input-field"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="input-field"
          />

          <p className="register-policy">
            <Checkbox
              {...label}
              defaultChecked
              sx={{
                color: "#6c7c59",
                "&.Mui-checked": {
                  color: "#6c7c59",
                },
              }}
            />
            I have read and accept the <a href="/policy">Term of use</a> and{" "}
            <a href="/policy">Privacy Policy</a>, and I consent to the
            processing of my data for marketing purposes by The Design Grit.
          </p>
          <button type="submit" className="btn signin-btn">
            Sign Up
          </button>
        </form>
        <p className="register-link">
          If you Already have account?<a href="/login">Sign In</a>
        </p>
      </div>
    </div>
  );
}

export default SignUpForm;
