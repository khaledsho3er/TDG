import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useCart } from "./cartcontext"; // Assuming the context is in the same directory

const ShoppingCartOverlay = ({ open, onClose }) => {
  const { cart } = useCart(); // Access the cart from context

  if (!open) return null; // Don't render if the overlay is closed

  // Safely handle undefined or empty cart
  const cartItems = cart || [];
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.price || 0),
    0
  );

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "300px",
        height: "80%",
        backgroundColor: "white",
        boxShadow: "-2px 0 5px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        zIndex: 1000,
      }}
      className="Cart-popup"
    >
      <Typography variant="h6">Your Shopping Cart</Typography>
      {cartItems.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <Box>
          {cartItems.map((item, index) => (
            <Box key={index} sx={{ marginBottom: "8px" }}>
              <Typography>{item.name}</Typography>
              <Typography>{`Price: $${item.price}`}</Typography>
            </Box>
          ))}
          <Typography variant="h6">{`Total: $${totalPrice}`}</Typography>
        </Box>
      )}
      <Button onClick={onClose} variant="contained" sx={{ marginTop: "auto" }}>
        Close
      </Button>
    </Box>
  );
};

export default ShoppingCartOverlay;
