import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";

const ForgotPasswordDialog = ({ open, onClose }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://tdg-db.onrender.com/api/forget-password/send-otp",
        {
          email,
        }
      );

      if (response.status === 200) {
        setStep(2);
        setError("");
      } else {
        setError(response.data.message || "Failed to send OTP.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://tdg-db.onrender.com/api/forget-password/verify-otp",
        {
          email,
          otp,
        }
      );

      if (response.status === 200) {
        setStep(3);
        setError("");
      } else {
        setError(response.data.message || "Invalid OTP.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://tdg-db.onrender.com/api/forget-password/reset-password",
        {
          email,
          newPassword,
        }
      );

      if (response.status === 200) {
        onClose(); // Close the dialog after successful reset
      } else {
        setError(response.data.message || "Failed to reset password.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{
        zIndex: 1000,
        position: "fixed",
        backdropFilter: "blur(4px)",
        "& .MuiPaper-root": {
          borderRadius: "16px",
          backdropFilter: "blur(5px)",
          backgroundColor: "#ebe4e5",
        },
      }}
    >
      <DialogTitle
        sx={{ fontWeight: "normal", color: "#2d2d2d", marginBottom: "20px" }}
      >
        {step === 1
          ? "Forgot Password"
          : step === 2
          ? "Enter OTP"
          : "Reset Password"}
      </DialogTitle>

      <DialogContent sx={{ color: "#eee", marginBottom: "20px" }}>
        {error && <p style={{ color: "red", marginBottom: "30px" }}>{error}</p>}

        {step === 1 && (
          <>
            <TextField
              label="Enter your email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ marginBottom: "20px" }}
            />
          </>
        )}

        {step === 2 && (
          <>
            <TextField
              label="Enter OTP"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              sx={{ marginBottom: "20px" }}
            />
          </>
        )}

        {step === 3 && (
          <>
            <TextField
              label="New Password"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ marginBottom: "10px" }}
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ marginBottom: "20px" }}
            />
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} sx={{ color: "white" }}>
          Cancel
        </Button>

        {step === 1 && (
          <Button
            onClick={handleSendOTP}
            disabled={loading}
            sx={{ color: "#2d2d2d" }}
          >
            {loading ? "Sending..." : "Send OTP"}
          </Button>
        )}

        {step === 2 && (
          <Button
            onClick={handleVerifyOTP}
            disabled={loading}
            sx={{ color: "#2d2d2d" }}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        )}

        {step === 3 && (
          <Button
            onClick={handleResetPassword}
            disabled={loading}
            sx={{ color: "#2d2d2d" }}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
