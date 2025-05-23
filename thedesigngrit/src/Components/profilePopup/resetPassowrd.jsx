import React, { useState, useContext } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import ForgotPasswordDialog from "../forgetPassword";
import ConfirmationDialog from "../confirmationMsg";
import { UserContext } from "../../utils/userContext";
const ResetPasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [strength, setStrength] = useState(0);
  // const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [forgotPasswordDialogOpen, setForgotPasswordDialogOpen] =
    useState(false);
  const [forgotPasswordSuccessDialogOpen, setForgotPasswordSuccessDialogOpen] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const { userSession } = useContext(UserContext);

  const handleChangePasswordClick = () => {
    // Open the confirmation dialog
    setDialogOpen(true);
  };

  const handleConfirmPasswordChange = async () => {
    // Close the confirmation dialog
    setDialogOpen(false);

    // Proceed with the password change
    setError("");
    setLoading(true);

    if (newPassword.trim() !== confirmPassword.trim()) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        `https://api.thedesigngrit.com/api/changePassword/${userSession.id}`,
        { currentPassword, newPassword },
        {
          withCredentials: true,
        }
      );

      if (
        response.status === 200 &&
        response.data.message === "Password updated successfully"
      ) {
        setSuccess("Password updated successfully.");
        setSuccessDialogOpen(true);
      } else {
        setError(response.data.message || "Failed to update password.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPasswordChange = () => {
    // Close the confirmation dialog without updating the password
    setDialogOpen(false);
  };

  const calculateStrength = (password) => {
    let strengthScore = 0;
    if (password.length >= 8) strengthScore += 25;
    if (/[a-z]/.test(password)) strengthScore += 25;
    if (/[A-Z]/.test(password)) strengthScore += 25;
    if (/[\d!@#$%^&*]/.test(password)) strengthScore += 25;
    return strengthScore;
  };

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
    <Box sx={{ width: "100%", flexDirection: "column", alignItems: "center" }}>
      {error && (
        <p style={{ color: "green", fontFamily: "Montserrat" }}>{error}</p>
      )}
      {success && (
        <p style={{ color: "green", fontFamily: "Montserrat" }}>{success}</p>
      )}

      <div
        className="reset-form-field"
        style={{ position: "relative", marginBottom: "1rem" }}
      >
        <label>Current Password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          style={passwordFieldStyle(true)}
          className="reset-popup-form-full-width"
        />
        {/* <span
          onClick={() => setShowCurrentPassword((prevState) => !prevState)}
          style={{
            position: "absolute",
            transform: "translateY(50%)",
            right: "10px",
            top: "45px", // adjust based on input height
            cursor: "pointer",
            color: "#6b7b58",
          }}
        >
          {showCurrentPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </span> */}

        <div style={{ textAlign: "right", marginTop: "0.25rem" }}>
          <span
            onClick={() => setForgotPasswordDialogOpen(true)}
            className="forgot-password-link"
            style={{ fontSize: "0.85rem", cursor: "pointer", color: "#6b7b58" }}
          >
            Forgot Password?
          </span>
        </div>
      </div>

      <div className="reset-form-field" style={{ position: "relative" }}>
        <label>New Password</label>
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
            top: "53%",
            transform: "translateY(-50%)",
            right: "10px",
            cursor: "pointer",
            color: "#6b7b58",
          }}
        >
          {showNewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </span>

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

      <div className="reset-form-field" style={{ position: "relative" }}>
        <label>Re-type Password</label>
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
            transform: "translateY(42%)",
            right: "10px",
            cursor: "pointer",
            color: "#6b7b58",
          }}
        >
          {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </span>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Typography variant="body2">Password Requirements:</Typography>
        <ul>
          <li style={{ color: requirements.minLength ? "green" : "red" }}>
            Minimum length: 8 characters
          </li>
          <li style={{ color: requirements.hasLowerCase ? "green" : "red" }}>
            Contains lowercase letter
          </li>
          <li style={{ color: requirements.hasUpperCase ? "green" : "red" }}>
            Contains uppercase letter
          </li>
          <li
            style={{ color: requirements.hasNumberOrSpecial ? "green" : "red" }}
          >
            Contains number or special character
          </li>
        </ul>
      </div>

      <div className="reset-popup-buttons">
        <button
          className="reset-popUpForm-btn-save"
          onClick={handleChangePasswordClick}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>

      <ForgotPasswordDialog
        open={forgotPasswordDialogOpen}
        onClose={() => setForgotPasswordDialogOpen(false)}
        onSend={() => setForgotPasswordSuccessDialogOpen(true)}
      />

      <ConfirmationDialog
        open={dialogOpen}
        title="Confirm Password Update"
        content="Are you sure you want to update your password?"
        onConfirm={handleConfirmPasswordChange}
        onCancel={handleCancelPasswordChange}
      />

      <ConfirmationDialog
        open={successDialogOpen}
        title="Password Updated"
        content="Your password has been successfully updated."
        onConfirm={() => setSuccessDialogOpen(false)}
        onCancel={() => setSuccessDialogOpen(false)}
      />

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
