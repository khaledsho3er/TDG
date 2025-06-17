import React from "react";
import { Box, Typography, Button, CardMedia } from "@mui/material";

function VendorProfileHeader({ vendor }) {
  const fullImagePath = vendor.brandlogo
    ? `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${vendor.brandlogo}` // Full image path for rendering
    : "/Assets/TDG_Logo_Black.webp"; // Default (static) image if brandlogo isn't available

  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: "24px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        maxWidth: "1200px",
        margin: "0 auto",
        mt: { xs: 2, md: 4 },
        mb: { xs: 2, md: 4 },
        px: { xs: 2, md: 6 },
        py: { xs: 2, md: 4 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: { md: "space-between" },
        alignItems: { xs: "center", md: "flex-start" },
        gap: { xs: "20px", md: "0" },
        borderBottom: "none",
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          width: { xs: "120px", md: "150px" },
          height: { xs: "120px", md: "150px" },
          backgroundColor: "transparent",
          borderRadius: "16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
          },
          marginRight: { xs: 0, md: "20px" },
        }}
      >
        <CardMedia
          component="img"
          src={fullImagePath || "//Assets/TDG_Logo_Black.webp"}
          alt="Logo"
          sx={{
            width: { xs: "100px", md: "120px" },
            borderRadius: "16px",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </Box>
      {/* Content Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {/* Title and Buttons in One Row */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: { xs: "center", md: "space-between" },
            alignItems: "center",
            gap: { xs: "10px", md: "0" },
          }}
        >
          <Typography
            sx={{
              fontFamily: "Horizon",
              fontWeight: "bold",
              fontSize: { xs: "18px", md: "20px" },
              margin: 0,
            }}
          >
            {vendor.brandName}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              flexWrap: { xs: "wrap", md: "nowrap" },
              justifyContent: { xs: "center", md: "flex-end" },
            }}
          >
            <Button
              variant="outlined"
              sx={{
                width: "8rem",
                height: "40px",
                borderRadius: "6px",
                color: "white",
                backgroundColor: "black",
                fontSize: "0.6rem",
                fontFamily: "montserrat, san-serif",
              }}
              className="Vendorprofile-contact-button"
              onClick={() => (window.location.href = `mailto:${vendor.email}`)}
            >
              Contact
            </Button>
            <Button
              variant="contained"
              sx={{
                width: "8rem",
                height: "40px",
                borderRadius: "6px",
                color: "Black",
                backgroundColor: "#E5E5E5",
                fontSize: "0.6rem",
                fontFamily: "montserrat, san-serif",
              }}
              className="Vendorprofile-website-button"
              onClick={() => (window.location.href = vendor.websiteURL)}
            >
              Vendor Website
            </Button>
          </Box>
        </Box>
        {/* Description Text */}
        <Typography
          sx={{
            fontFamily: "Arial, sans-serif",
            color: "gray",
            fontSize: "14px",
            marginTop: "8px",
            lineHeight: "1.5",
            textAlign: { xs: "justify", md: "left" },
            padding: "10px",
          }}
        >
          {vendor.brandDescription}
        </Typography>
      </Box>
    </Box>
  );
}

export default VendorProfileHeader;
