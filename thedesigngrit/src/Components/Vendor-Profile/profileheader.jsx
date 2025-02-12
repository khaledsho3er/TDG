import React from "react";
import { Box, Typography, Button, CardMedia } from "@mui/material";

function VendorProfileHeader({ vendor }) {
  const fullImagePath = `https://tdg-db.onrender.com/uploads/${vendor.brandlogo}`; // Full image path for rendering

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: { md: "space-between" },
        alignItems: { xs: "center", md: "flex-start" },
        padding: { xs: "20px", md: "20px 60px" },
        gap: { xs: "20px", md: "0" },
        borderBottom: "2px solid #ddd", // Added bottom border
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          width: { xs: "120px", md: "150px" },
          height: { xs: "120px", md: "150px" },
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow:
            "0px 4px 15px rgba(0, 0, 0, 0.1), 0px 8px 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.2)",
          },
          marginRight: "20px",
        }}
      >
        <CardMedia
          component="img"
          src={fullImagePath || "/Assets/Vendors/default-logo.png"} // Use dynamic logo or fallback
          alt="Logo"
          sx={{
            width: { xs: "80px", md: "100px" },
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
            {vendor.brandName} {/* Vendor Name */}
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
                height: "25px",
                borderRadius: "5px",
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
                height: "25px",
                borderRadius: "5px",
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
            marginTop: "8px", // Space between title and description
            lineHeight: "1.5", // Line height for readability
            textAlign: { xs: "center", md: "left" }, // Centered for small screens
          }}
        >
          {vendor.brandDescription} {/* Vendor Description */}
        </Typography>
      </Box>
    </Box>
  );
}

export default VendorProfileHeader;
