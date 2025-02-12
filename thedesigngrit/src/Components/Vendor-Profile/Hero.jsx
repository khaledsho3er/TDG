import React from "react";
import { Box } from "@mui/material";

function VendorProfileHero({ vendor }) {
  const fullImagePath = `https://tdg-db.onrender.com/uploads/${vendor.coverPhoto}`; // Full image path for rendering

  // Log the image path for debugging
  console.log("Full Image Path:", fullImagePath);

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
        src={fullImagePath} // Use dynamic photo or default if not available
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

export default VendorProfileHero;
