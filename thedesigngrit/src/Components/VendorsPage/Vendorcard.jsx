import React from "react";
import { Box, Typography, Card, CardMedia, CardContent } from "@mui/material";

const VendorCard = ({ vendor, onClick }) => {
  const { brandlogo, products = [], brandName } = vendor;

  return (
    <Card
      sx={{
        width: 300,
        height: 350, // Ensure height is fixed
        borderRadius: 4,
        boxShadow: 3,
        overflow: "hidden",
        textAlign: "center",
        border: "1px solid #ddd",
        margin: 2,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={onClick}
    >
      {/* Content Wrapper */}
      <Box sx={{ flexGrow: 1 }}>
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
            image={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${brandlogo}`}
            alt={`${brandName} logo`}
            sx={{ maxHeight: "80%", maxWidth: "80%", objectFit: "contain" }}
          />
        </Box>

        {/* Product Images */}
        <Box sx={{ padding: 1 }}>
          {Array.isArray(products) && products.length > 0 ? (
            products.slice(0, 4).map((product, index) => (
              <CardMedia
                component="img"
                key={index}
                image={product}
                alt={`Product ${index + 1}`}
                sx={{
                  height: 100,
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
      </Box>

      {/* Vendor Name - Pushed to Bottom */}
      <CardContent
        sx={{
          padding: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            fontFamily: "Horizon",
            color: "#333",
          }}
        >
          {brandName}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default VendorCard;
