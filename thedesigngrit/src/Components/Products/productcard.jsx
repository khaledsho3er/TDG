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
import FavoriteIcon from "@mui/icons-material/Favorite";

const ProductCard = ({ product, onToggleFavorite, isFavorite }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product._id}`); // Navigate to the product details page using _id
  };

  const toggleFavorite = (event) => {
    event.stopPropagation(); // Prevent triggering card click
    onToggleFavorite(product); // Pass the product to the parent handler
  };

  return (
    <Box style={{ cursor: "pointer" }}>
      <Card
        sx={{
          width: 250,
          borderRadius: "16px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          position: "relative",
          overflow: "hidden",
        }}
        onClick={handleCardClick}
      >
        {/* Product Image */}
        <CardMedia
          component="img"
          height="250"
          image={`http://localhost:5000${product.mainImage}`}
          alt={product.name}
          sx={{
            objectFit: "cover",
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
          onClick={toggleFavorite}
        >
          {isFavorite ? (
            <FavoriteIcon sx={{ color: "red" }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: "#000" }} />
          )}
        </IconButton>
      </Card>

      {/* Product Information */}
      <CardContent sx={{ padding: "10px" }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: "16px",
            fontWeight: 700,
            fontFamily: "Montserrat",
            textTransform: "uppercase",
            width: "100%",
            color: "#2d2d2d",
            maxWidth: "80%",
          }}
        >
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontSize: "12px",
            fontFamily: "Montserrat  ",
            color: "#757575",
            marginTop: "4px",
          }}
        >
          {product.description}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: "14px",
            fontWeight: 500,
            fontFamily: "Montserrat  ",
            color: "#2d2d2d",
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
