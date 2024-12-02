import React from "react";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";

const VendorCategoryCard = ({ title, description, price, image }) => {
  return (
    <Card
      sx={{
        height: 400,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {/* Image Section */}
      <CardMedia
        component="img"
        image={image}
        alt={`${title} Image`}
        sx={{
          width: "100%",
          height: "60%",
          objectFit: "cover",
        }}
      />

      {/* Card Content Section */}
      <CardContent
        sx={{
          padding: 1.5,
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            fontSize: 14,
            marginBottom: "4px",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: 12,
            color: "text.secondary",
            marginBottom: "8px",
          }}
        >
          {description}
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontWeight: "bold", fontSize: 16, color: "text.primary" }}
        >
          {price}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default VendorCategoryCard;
