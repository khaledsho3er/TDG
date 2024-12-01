import React from "react";
import { Box, Typography, Button } from "@mui/material";

function Vendorprofilehero() {
  return (
    <Box
      sx={{
        width: "98.7vw", // Full viewport width
        height: "300px", // Fixed height
        overflow: "hidden", // Prevents content overflow
        display: "flex", // Ensures proper alignment
        justifyContent: "center", // Centers content if needed
      }}
    >
      <img
        src="/Assets/VendorProfile/vendor-hero.png"
        alt="Vendor Hero"
        style={{
          width: "100%", // Scale the image to fit the width of the screen
          height: "300px", // Fixed height
          objectFit: "cover", // Ensures the image is contained proportionally
        }}
      />
    </Box>
  );
}

export default Vendorprofilehero;
