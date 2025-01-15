import React, { useState } from "react";
import axios from "axios"; // For sending requests
import { Box, Typography } from "@mui/material";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import ForgotPasswordDialog from "../forgetPassword";
import ConfirmationDialog from "../confirmationMsg";

const ResetPasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // To handle error messages
  const [success, setSuccess] = useState(""); // To handle success messages
  const [strength, setStrength] = useState(0);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [forgotPasswordDialogOpen, setForgotPasswordDialogOpen] =
    useState(false);
  const [forgotPasswordSuccessDialogOpen, setForgotPasswordSuccessDialogOpen] =
    useState(false);
  const [loading, setLoading] = useState(false); // Loading state for the button

  const handleReset = async () => {
    setError(""); // Clear previous errors
    setLoading(true); // Show loading spinner

    // Validate if passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("User not authenticated. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await axios.put(
        "http://localhost:5000/api/changePassword",
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message === "Password updated successfully") {
        setSuccess("Password updated successfully.");
        setSuccessDialogOpen(true); // Open success dialog
      } else {
        setError("Failed to update password.");
      }
    } catch (error) {
      console.error("Error updating password:", error.response?.data);
      setError(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  // Calculate password strength
  const calculateStrength = (password) => {
    let strengthScore = 0;
    if (password.length >= 8) strengthScore += 25;
    if (/[a-z]/.test(password)) strengthScore += 25;
    if (/[A-Z]/.test(password)) strengthScore += 25;
    if (/[\d!@#$%^&*]/.test(password)) strengthScore += 25;
    return strengthScore;
  };

  // Password validation requirements
  const [requirements, setRequirements] = useState({
    minLength: false,
    hasLowerCase: false,
    hasUpperCase: false,
    hasNumberOrSpecial: false,
    passwordsMatch: false,
  });

  const validatePassword = (password) => {
    setRequirements({
      minLength: password.length >= 8,
      hasLowerCase: /[a-z]/.test(password),
      hasUpperCase: /[A-Z]/.test(password),
      hasNumberOrSpecial: /[\d!@#$%^&*]/.test(password),
      passwordsMatch: password === confirmPassword,
    });
  };

  const handleNewPasswordChange = (value) => {
    setNewPassword(value);
    setStrength(calculateStrength(value));
    validatePassword(value);
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
      {error && (
        <p style={{ color: "red", fontFamily: "Montserrat" }}>{error}</p>
      )}
      {success && (
        <p style={{ color: "green", fontFamily: "Montserrat" }}>{success}</p>
      )}

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
            style={passwordFieldStyle(strength >= 50 && requirements.minLength)}
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
          sx={{ marginTop: "4px", color: getBarColors()[0] }}
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
            error={newPassword !== confirmPassword}
            helperText={
              newPassword !== confirmPassword ? "Passwords do not match" : ""
            }
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
        <button
          className="reset-popUpForm-btn-save"
          onClick={handleReset}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>

      {/* Forgot Password Dialog */}
      <ForgotPasswordDialog
        open={forgotPasswordDialogOpen}
        onClose={() => setForgotPasswordDialogOpen(false)}
        onSend={() => setForgotPasswordSuccessDialogOpen(true)}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={dialogOpen}
        title="Confirm Password Update"
        content="Are you sure you want to update your password?"
        onConfirm={() => {
          setDialogOpen(false);
          setSuccessDialogOpen(true);
        }}
        onCancel={() => setDialogOpen(false)}
      />

      {/* Success Confirmation Dialog */}
      <ConfirmationDialog
        open={successDialogOpen}
        title="Password Updated"
        content="Your password has been successfully updated. A confirmation email has been sent to your email address."
        onConfirm={() => setSuccessDialogOpen(false)}
        onCancel={() => setSuccessDialogOpen(false)}
      />

      {/* Forgot Password Success Dialog */}
      <ConfirmationDialog
        open={forgotPasswordSuccessDialogOpen}
        title="Reset Link Sent"
        content="A password reset link has been sent to your email."
        onConfirm={() => setForgotPasswordSuccessDialogOpen(false)}
        onCancel={() => setForgotPasswordSuccessDialogOpen(false)}
      />
    </Box>
  );
};

export default ResetPasswordForm;
