import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";

const ForgotPasswordDialog = ({ open, onClose, onSend }) => {
  const [email, setEmail] = useState("");

  const handleSendResetLink = () => {
    if (!email) {
      alert("Please enter your email address.");
      return;
    }
    onSend(); // Trigger the sending process (success dialog will open)
    onClose(); // Close the forgot password dialog
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
          borderRadius: "16px", // Add border radius here
          backdropFilter: "blur(5px)",
          backgroundColor: "#6b7b58",
        },
      }}
    >
      <DialogTitle
        sx={{ fontWeight: "normal", color: "#2d2d2d", marginBottom: "20px" }}
      >
        Forgot Password
      </DialogTitle>
      <DialogContent sx={{ color: "#eee", marginBottom: "20px" }}>
        <TextField
          label="Enter your email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            marginBottom: "20px",
            color: "#eee", // Label color
            "& .MuiInputBase-root": {
              border: "1px solid #2d2d2d",
              borderRadius: "4px",
              "&:focus": {
                border: "1px solid #6b7b58", // Keep custom border on focus
              },
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#6b7b58", // Custom border color
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "#6b7b58", // Override blue border on focus
              },
            // Disable the default blue color on the label when focused
            "& .MuiInputLabel-root": {
              color: "#2d2d2d", // Custom label color (light gray)
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#2d2d2d",
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            color: "white",
            border: "none",
            "&:hover": {
              backgroundColor: "#2d2d2d",
              border: "none",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSendResetLink}
          sx={{
            color: "white",
            border: "none",
            "&:hover": {
              backgroundColor: "#2d2d2d",
              border: "none",
            },
          }}
        >
          Send Reset Link
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
