import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

const ConfirmationDialog = ({ open, title, content, onConfirm, onCancel }) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      sx={{
        zIndex: 9999,
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
        style={{
          fontWeight: "normal",
          backgroundColor: "#6b7b58",
          color: "white",
          paddingLeft: "16px",
          border: "none",
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent
        style={{
          fontWeight: "bold",
          backgroundColor: "#6b7b58",
          color: "white",
        }}
      >
        {content}
      </DialogContent>
      <DialogActions
        style={{
          fontWeight: "bold",
          backgroundColor: "#6b7b58",
        }}
      >
        <Button
          onClick={onCancel}
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
          onClick={onConfirm}
          sx={{
            color: "white",
            border: "none",
            "&:hover": {
              backgroundColor: "#2d2d2d",
              border: "none",
            },
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
