import React from "react";
import { Card, CardMedia, Typography, Box } from "@mui/material";

const VendorCatalogCard = ({ title, year, image, type, pdf }) => {
  // Function to handle clicking on the card to open the PDF
  const handleClick = () => {
    const pdfUrl = `${pdf}`;
    window.open(pdfUrl, "_blank"); // Opens the PDF in a new tab
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      {/* Card Container */}
      <Card
        sx={{
          height: 400, // Keep the original height
          display: "flex",
          flexDirection: "column",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
          width: "100%",
          cursor: "pointer", // Make the card clickable
        }}
        onClick={handleClick} // Set the click event on the entire card
      >
        {/* Image Container */}
        <Box sx={{ position: "relative", flex: 1 }}>
          <CardMedia
            component="img"
            image={image} // Full image path
            alt={`${title} Cover`}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {/* Badge */}
          <Box
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              color: "#fff",
              padding: "4px 8px",
              fontSize: 12,
              borderRadius: 1,
              fontFamily: "Montserrat",
            }}
          >
            {type}
          </Box>
        </Box>
      </Card>

      {/* Title and Year Section */}
      <Box
        sx={{
          paddingTop: 1,
          width: "100%",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            fontSize: 14,
            marginBottom: "4px",
            textAlign: "left",
            fontFamily: "Montserrat",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: 12,
            color: "text.secondary",
            textAlign: "left",
            fontFamily: "Montserrat",
          }}
        >
          {year}
        </Typography>
      </Box>
    </Box>
  );
};

export default VendorCatalogCard;
