import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const ResetPasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState(0);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Calculate password strength
  const calculateStrength = (password) => {
    let strengthScore = 0;
    if (password.length >= 8) strengthScore += 25;
    if (/[a-z]/.test(password)) strengthScore += 25;
    if (/[A-Z]/.test(password)) strengthScore += 25;
    if (/[\d!@#$%^&*]/.test(password)) strengthScore += 25;
    return strengthScore;
  };

  const handleNewPasswordChange = (value) => {
    setNewPassword(value);
    setStrength(calculateStrength(value));
  };

  const passwordFieldStyle = (condition) => ({
    border: `1px solid ${condition ? "green" : "red"}`,
    padding: "8px",
    transition: "border-color 0.3s ease-in-out",
    position: "relative",
  });

  const getBarColors = () => {
    if (strength <= 50) return ["red", "gray", "gray", "gray"];
    if (strength <= 75) return ["orange", "orange", "gray", "gray"];
    return ["green", "green", "green", "green"];
  };

  return (
    <Box className="reset-password-content">
      {/* Current Password Field */}
      <div className="reset-form-field" style={{ position: "relative" }}>
        <label>Current Password</label>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            type={showCurrentPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={passwordFieldStyle(true)} // Always valid for current password
            className="reset-popup-form-full-width"
          />
          <span
            onClick={() => setShowCurrentPassword((prevState) => !prevState)}
            style={{
              position: "absolute",
              right: "10px",
              cursor: "pointer",
              color: "#6b7b58",
            }}
          >
            {showCurrentPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>
      </div>

      {/* New Password Field */}
      <div className="reset-form-field" style={{ position: "relative" }}>
        <label>New Password</label>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => handleNewPasswordChange(e.target.value)}
            style={passwordFieldStyle(strength >= 50)}
            className="reset-popup-form-full-width"
          />
          <span
            onClick={() => setShowNewPassword((prevState) => !prevState)}
            style={{
              position: "absolute",
              right: "10px",
              cursor: "pointer",
              color: "#6b7b58",
            }}
          >
            {showNewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>

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
          sx={{
            marginTop: "4px",
            color: getBarColors()[0],
          }}
        >
          {strength <= 50 ? "Weak" : strength <= 75 ? "Medium" : "Strong"}
        </Typography>
      </div>

      {/* Re-type Password Field */}
      <div className="reset-form-field" style={{ position: "relative" }}>
        <label>Re-type Password</label>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={passwordFieldStyle(confirmPassword === newPassword)}
            className="reset-popup-form-full-width"
          />
          <span
            onClick={() => setShowConfirmPassword((prevState) => !prevState)}
            style={{
              position: "absolute",
              right: "10px",
              cursor: "pointer",
              color: "#6b7b58",
            }}
          >
            {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="reset-popup-buttons">
        <button className="reset-popUpForm-btn-save">Update Password</button>
      </div>
    </Box>
  );
};

export default ResetPasswordForm;
