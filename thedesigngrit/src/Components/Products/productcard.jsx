import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom";

// Card Component to Render Individual Product
const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`); // Navigate to a dynamic route using the product ID
  };

  return (
    <Box onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <Card
        sx={{
          width: 250,
          borderRadius: "16px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Product Image */}
        <CardMedia
          component="img"
          height="250"
          image={product.imageUrl} // Updated to match JSON structure
          alt={product.name} // Updated to use the name field
          sx={{
            objectFit: "cover",
            fontFamily: "horizon",
            fontWeight: "Bold",
          }}
        />

        {/* Favorite Icon */}
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "#fff",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
        >
          <FavoriteBorderIcon sx={{ color: "#000" }} />
        </IconButton>
      </Card>
      {/* Product Information */}
      <CardContent sx={{ padding: "16px" }}>
        {/* Name */}
        <Typography
          variant="h6"
          sx={{
            fontSize: "16px",
            fontWeight: 700,
            fontFamily: "Montserrat, sans-serif",
            textTransform: "uppercase",
          }}
        >
          {product.name}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            fontSize: "12px",
            fontFamily: "Montserrat, sans-serif",
            color: "#757575",
            marginTop: "4px",
          }}
        >
          {product.description}
        </Typography>

        {/* Price */}
        <Typography
          variant="body1"
          sx={{
            fontSize: "14px",
            fontWeight: 500,
            fontFamily: "Montserrat, sans-serif",
            color: "#000",
            marginTop: "8px",
          }}
        >
          {product.price}
        </Typography>
      </CardContent>
    </Box>
  );
};

export default ProductCard;
