import React from "react";
import { Box, IconButton } from "@mui/material";
import { FaPaintBrush } from "react-icons/fa";

function StickedButton() {
  return (
    <Box
      sx={{
        position: "absolute", // Absolute position relative to the parent container
        top: 80, // Align to the top
        left: 30, // Align to the left
        zIndex: 1000,
      }}
    >
      <IconButton
        size="medium"
        sx={{
          backgroundColor: "#5F7C5F", // Green color
          color: "#ffffff", // White icon color
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Adds a subtle shadow
          ":hover": {
            backgroundColor: "#4E644E", // Darker green on hover
          },
        }}
      >
        <FaPaintBrush />
      </IconButton>
    </Box>
  );
}

export default StickedButton;
