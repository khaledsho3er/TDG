import React, { useState } from "react";
import { Box } from "@mui/material";
import axios from "axios"; // For sending requests

const ResetPasswordPopup = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // To handle error messages
  const [success, setSuccess] = useState(""); // To handle success messages

  const handleReset = async () => {
    setError(""); // Clear previous errors

    // Validate if passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Validate password length
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken"); // Get the token from localStorage
      const response = await axios.post(
        "http://localhost:5000/api/changePassword",
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` }, // Add the token in the request header
        }
      );

      if (response.data.message === "Password updated successfully") {
        setSuccess("Password updated successfully.");
      } else {
        setError("Failed to update password.");
      }
    } catch (error) {
      // Check for server response and log the error
      console.error("Error updating password:", error.response?.data);
      setError(error.response?.data?.message || "An error occurred.");
    }
  };

  const handleCancel = () => {
    // Clear form and close popup (if needed)
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
    console.log("Canceling password reset...");
  };

  return (
    <Box className="reset-password-content">
      {error && (
        <p style={{ color: "red", fontFamily: "Montserrat" }}>{error}</p>
      )}
      {success && (
        <p style={{ color: "green", fontFamily: "Montserrat" }}>{success}</p>
      )}

      <div className="reset-form-field">
        <label>Current Password</label>
        <input
          label="Current Password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          fullWidth
          margin="normal"
          className="reset-popup-form-full-width"
        />
      </div>

      <div className="reset-form-field">
        <label>New Password</label>
        <input
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          margin="normal"
          className="reset-popup-form-full-width"
          helperText="Min. Length: 8 characters. Character Types: Uppercase, lowercase, number, special character."
        />
      </div>

      <div className="reset-form-field">
        <label>Re-type Password</label>
        <input
          label="Re-type Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          margin="normal"
          className="reset-popup-form-full-width"
          error={newPassword !== confirmPassword}
          helperText={
            newPassword !== confirmPassword ? "Passwords do not match" : ""
          }
        />
      </div>

      <div className="reset-popup-buttons">
        <button className="reset-popUpForm-btn-save" onClick={handleReset}>
          Save
        </button>
        <button className="reset-popUpForm-btn-cancel" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </Box>
  );
};

export default ResetPasswordPopup;
