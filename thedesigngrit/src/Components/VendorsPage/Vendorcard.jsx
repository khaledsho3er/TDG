import React from "react";
import { Box, Typography, Card, CardMedia, CardContent } from "@mui/material";

const VendorCard = ({ vendor, onClick }) => {
  const { logo, products = [], name } = vendor; // Default to empty array if products is undefined

  return (
    <Card
      sx={{
        width: 250,
        borderRadius: 4,
        boxShadow: 3,
        overflow: "hidden",
        textAlign: "center",
        border: "1px solid #ddd",
        margin: 2,
        cursor: "pointer", // Make the card visually clickable
      }}
      onClick={onClick} // Handle the click on the entire card
    >
      {/* Vendor Logo */}
      <Box
        sx={{
          height: 70,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <CardMedia
          component="img"
          image={logo}
          alt={`${name} logo`}
          sx={{ maxHeight: "80%", maxWidth: "80%", objectFit: "contain" }}
        />
      </Box>

      {/* Product Images */}
      <Box sx={{ padding: 1 }}>
        {Array.isArray(products) && products.length > 0 ? (
          products
            .slice(0, 4)
            .map((product, index) => (
              <CardMedia
                component="img"
                key={index}
                image={product}
                alt={`Product ${index + 1}`}
                sx={{
                  height: 80,
                  borderRadius: 2,
                  objectFit: "cover",
                  border: "1px solid #ddd",
                }}
              />
            ))
        ) : (
          <Typography variant="body2" sx={{ color: "gray" }}>
            No products available
          </Typography>
        )}
      </Box>

      {/* Vendor Name */}
      <CardContent>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", fontFamily: "Horizon", color: "#333" }}
        >
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default VendorCard;
