import React from "react";
import { Box, IconButton } from "@mui/material";
import MessageIcon from "@mui/icons-material/Message"; // You can replace this icon as needed.

function FloatingButton() {
  return (
    <Box
      sx={{
        position: "fixed", // Fixes the button in place
        bottom: 16, // Distance from the bottom of the viewport
        right: 16, // Distance from the left of the viewport
        zIndex: 1000, // Ensures it stays above most content
      }}
    >
      <IconButton
        size="large"
        sx={{
          backgroundColor: "#5F7C5F", // Green color
          color: "#ffffff", // White icon color
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Adds a subtle shadow
          ":hover": {
            backgroundColor: "#4E644E", // Darker green on hover
          },
        }}
      >
        <MessageIcon />
      </IconButton>
    </Box>
  );
}

export default FloatingButton;
