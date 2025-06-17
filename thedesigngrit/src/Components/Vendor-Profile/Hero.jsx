import React from "react";
import { Box } from "@mui/material";

function VendorProfileHero({ vendor }) {
  const fullImagePath = vendor.coverPhoto
    ? `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${vendor.coverPhoto}` // Full image path for rendering
    : "/Assets/placeHolderCover.png"; // Default (static) image if no coverPhoto is available

  // Log the image path for debugging
  console.log("Full Image Path:", fullImagePath);

  return (
    <Box
      sx={{
        width: { xs: "70%", md: "80%", lg: "70%" },
        maxWidth: "1200px",
        height: { xs: "220px", sm: "320px", md: "400px", lg: "450px" },
        margin: "32px auto 0 auto",
        background: "#fff",
        borderRadius: "24px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: { xs: "0", md: "0" },
      }}
    >
      <img
        src={fullImagePath}
        alt="Vendor Hero"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "24px",
        }}
      />
    </Box>
  );
}

export default VendorProfileHero;
