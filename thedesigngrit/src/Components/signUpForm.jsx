import React, { useState } from "react";
import { Checkbox } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AccountSentPopup from "./successfullyRegistered";

function SignUpForm() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address1: "",
    address2: "",
    dateOfBirth: "",
    gender: "",
    language: "",
    region: "",
    shipmentAddress: "",
  });

  const [passwordError, setPasswordError] = useState(""); // State for password error

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "password") {
      validatePassword(value); // Validate password as the user types
    }
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordError) {
      return; // Prevent submission if there's a password error
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/signup",
        formData
      );

      alert(response.data.message);
      setIsPopupVisible(true);

      navigate("/login");
    } catch (error) {
      console.error("There was an error during sign-up:", error);
      alert(
        error.response?.data?.message || "An error occurred during sign-up"
      );
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <div>
      <h1 className="form-title-signup">Register</h1>
      <div className="signup-form">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="E-mail"
            className="input-field"
            required
          />
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="input-field"
            required
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="input-field"
            required
          />
          <div style={{ position: "relative" }}>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="input-field"
              required
            />
            {passwordError && (
              <div
                style={{
                  position: "absolute",
                  width: "80%",
                  top: "50%",
                  left: "105%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(255, 0, 0, 0.9)",
                  color: "white",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  fontSize: "12px",
                  fontFamily: "Montserrat, sans-serif",
                  zIndex: 1000,
                }}
              >
                {passwordError}
              </div>
            )}
          </div>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="input-field"
            required
          />
          <div className="register-policy-section">
            <Checkbox
              defaultChecked
              sx={{
                color: "#efebe8",
                "&.Mui-checked": {
                  color: "#efebe8",
                },
              }}
            />
            <p className="register-policy">
              I have read and accept the <a href="/policy">Terms of use</a> and
              <a href="/policy">Privacy Policy</a>, and I consent to the
              processing of my data for marketing purposes by The Design Grit.
            </p>
          </div>
          <button
            type="submit"
            className="btn signin-btn"
            disabled={!!passwordError} // Disable submit if there's a password error
          >
            Sign Up
          </button>
        </form>
        <p className="register-link">
          If you already have an account?<a href="/login">Sign In</a>
        </p>
      </div>
      <AccountSentPopup show={isPopupVisible} closePopup={closePopup} />
    </div>
  );
}

export default SignUpForm;
