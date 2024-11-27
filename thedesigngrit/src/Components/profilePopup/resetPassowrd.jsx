import React, { useState } from "react";
import { Box } from "@mui/material";

const ResetPasswordPopup = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = () => {
    // Add your reset password logic here
    console.log("Resetting password...");
  };

  const handleCancel = () => {
    // Add your cancel logic here
    console.log("Canceling password reset...");
  };

  return (
    <Box className="reset-password-content">
      <div className="reset-form-field">
        <label>Current Passowrd</label>
        <input
          label="Current Passord"
          type="password"
          variant="outlined"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          fullWidth
          margin="normal"
          className="reset-popup-form-full-width"
        />
      </div>
      <div className="reset-form-field">
        <label>New Passowrd</label>
        <input
          label="New Passord"
          variant="outlined"
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
        <label>Re-type Passowrd</label>
        <input
          label="Retype Passord"
          type="password"
          variant="outlined"
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
