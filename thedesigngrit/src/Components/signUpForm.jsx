import React, { useState } from "react";
import { Checkbox, Box, Typography } from "@mui/material";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AccountSentPopup from "./successfullyRegistered";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  const [strength, setStrength] = useState(0);
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const navigate = useNavigate();

  // Password strength calculation
  const calculateStrength = (password) => {
    let strengthScore = 0;
    if (password.length >= 8) strengthScore += 25;
    if (/[a-z]/.test(password)) strengthScore += 25;
    if (/[A-Z]/.test(password)) strengthScore += 25;
    if (/[\d!@#$%^&*]/.test(password)) strengthScore += 25;
    return strengthScore;
  };

  const getBarColors = () => {
    if (strength <= 50) return ["red", "#efebe8", "#efebe8", "#efebe8"];
    if (strength <= 75) return ["orange", "orange", "#efebe8", "#efebe8"];
    return ["green", "green", "green", "green"];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      setStrength(calculateStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }
    setPasswordError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/signup",
        formData
      );
      alert(response.data.message);
      setIsPopupVisible(true);
      navigate("/login");
    } catch (error) {
      console.error("Sign-up error:", error);
      alert(
        error.response?.data?.message || "An error occurred during sign-up."
      );
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <Box>
      <h1 className="form-title-signup">Register</h1>
      <form onSubmit={handleSubmit} className="signup-form">
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

        {/* Password Field */}
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="input-field"
            required
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>

        {/* Password Strength Bar */}
        <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
          {getBarColors().map((color, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                height: "8px",
                backgroundColor: color,
                borderRadius: "4px",
              }}
            ></div>
          ))}
        </div>
        <Typography
          variant="body2"
          style={{
            marginTop: "4px",
            color: strength <= 50 ? "red" : strength <= 75 ? "orange" : "green",
          }}
        ></Typography>

        {/* Confirm Password Field */}
        <div style={{ position: "relative", marginTop: "20px" }}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="input-field"
            required
          />
          <span
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
          >
            {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>

        {passwordError && (
          <div style={{ color: "red", marginTop: "10px" }}>{passwordError}</div>
        )}
        <div className="register-policy-container">
          <Checkbox
            defaultChecked
            sx={{
              color: "#efebe8",
              "&.Mui-checked": { color: "#efebe8" },
            }}
          />
          <p className="register-policy">
            I have read and accept the <a href="/policy">Terms of use</a> and{" "}
            <a href="/policy">Privacy Policy</a>.
          </p>
        </div>

        <button type="submit" className="btn signin-btn">
          Sign Up
        </button>
        <p className="register-link">
          Already have an account? <a href="/Login">Log In</a>
        </p>
      </form>
      <AccountSentPopup show={isPopupVisible} closePopup={closePopup} />
    </Box>
  );
};

export default SignUpForm;
