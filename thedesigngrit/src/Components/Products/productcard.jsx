import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../utils/userContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { userSession } = useContext(UserContext); // Access user session and logout function from context
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch the user's favorite products on component mount
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userSession) return; // Make sure userSession is available

      const response = await fetch(
        `https://tdg-db.onrender.com/api/favorites/${userSession.id}`
      );
      if (response.ok) {
        const favoritesData = await response.json();
        const favoriteIds = favoritesData.map((prod) => prod._id);
        setIsFavorite(favoriteIds.includes(product._id));
      }
    };
    fetchFavorites();
  }, [userSession, product._id]);

  // Toggle the favorite status
  const toggleFavorite = async (event) => {
    event.stopPropagation(); // Prevent triggering card click

    if (!userSession) return; // If there's no user session, prevent posting

    const endpoint = isFavorite ? "/remove" : "/add";
    const requestPayload = {
      userSession,
      productId: product._id,
    };

    try {
      const response = await fetch(
        `https://tdg-db.onrender.com/api/favorites${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestPayload),
        }
      );

      if (response.ok) {
        setIsFavorite(!isFavorite); // Toggle the favorite status if successful
      } else {
        console.error("Error: Unable to update favorite status.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Navigate to product details page
  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
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
        onClick={handleCardClick} // Card click for navigation
      >
        {/* Product Image */}
        <CardMedia
          component="img"
          height="250"
          image={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.mainImage}`}
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
          onClick={(event) => {
            event.stopPropagation(); // Prevent triggering card click when clicking favorite button
            toggleFavorite(event);
          }}
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
            fontFamily: "Montserrat",
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
            fontFamily: "Montserrat",
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
