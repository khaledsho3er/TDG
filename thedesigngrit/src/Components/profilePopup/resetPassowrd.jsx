import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import ForgotPasswordDialog from "../forgetPassword";
import ConfirmationDialog from "../confirmationMsg";

const ResetPasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [forgotPasswordDialogOpen, setForgotPasswordDialogOpen] =
    useState(false);
  const [forgotPasswordSuccessDialogOpen, setForgotPasswordSuccessDialogOpen] =
    useState(false);

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
    validatePassword(value);
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    validatePassword(newPassword);
  };

  const handleResetClick = () => {
    if (!Object.values(requirements).every((req) => req)) {
      alert("Please fulfill all password requirements.");
      return;
    }
    setDialogOpen(true);
  };
  const handleConfirm = () => {
    setDialogOpen(false);
    setSuccessDialogOpen(true);
  };
  const handleDialogCancel = () => setDialogOpen(false);

  const handleSuccessDialogClose = () => setSuccessDialogOpen(false);

  const handleForgotPassword = () => {
    setForgotPasswordDialogOpen(true); // Open the forgot password dialog
  };
  const passwordFieldStyle = (condition) => ({
    border: `1px solid ${condition ? "green" : "red"}`,
    padding: "8px",
    transition: "border-color 0.3s ease-in-out",
  });

  return (
    <Box className="reset-password-content">
      <div className="reset-form-field">
        <label>Current Password</label>
        <input
          label="Current Password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          fullWidth
          style={passwordFieldStyle(true)} // No validation needed for current password
          margin="normal"
          className="reset-popup-form-full-width"
        />
        <Typography
          variant="body2"
          color="primary"
          sx={{
            cursor: "pointer",
            marginTop: "5px",
            color: "#6b7b58",
            textAlign: "right",
          }}
          onClick={handleForgotPassword}
        >
          Forgot Password?
        </Typography>
      </div>

      <div className="reset-form-field">
        <label>New Password</label>
        <input
          label="New Password"
          variant="outlined"
          type="password"
          value={newPassword}
          onChange={(e) => handleNewPasswordChange(e.target.value)}
          style={passwordFieldStyle(requirements.minLength)}
          fullWidth
          margin="normal"
          className="reset-popup-form-full-width"
        />
      </div>

      <div className="reset-form-field">
        <label>Re-type Password</label>
        <input
          label="Re-type Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => handleConfirmPasswordChange(e.target.value)}
          fullWidth
          style={passwordFieldStyle(requirements.passwordsMatch)}
          margin="normal"
          className="reset-popup-form-full-width"
        />
      </div>

      <div className="reset-popup-buttons">
        <button className="reset-popUpForm-btn-save" onClick={handleResetClick}>
          Update Password
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
        onConfirm={handleConfirm}
        onCancel={handleDialogCancel}
      />

      {/* Success Confirmation Dialog */}
      <ConfirmationDialog
        open={successDialogOpen}
        title="Password Updated"
        content="Your password has been successfully updated. A confirmation email has been sent to your email address."
        onConfirm={handleSuccessDialogClose}
        onCancel={handleSuccessDialogClose}
      />

      {/* Success Confirmation Dialog */}
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
