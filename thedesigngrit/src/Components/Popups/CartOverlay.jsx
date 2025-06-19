import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { useCart } from "../../Context/cartcontext";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";
import { UserContext } from "../../utils/userContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete"; // Import DeleteIcon

const ShoppingCartOverlay = ({ open, onClose }) => {
  const { cartItems, removeFromCart, lastAddedItem, updateQuantity } =
    useCart(); // Add updateQuantity
  const isMobile = useMediaQuery("(max-width:768px)");
  const navigate = useNavigate();
  const { userSession } = useContext(UserContext); // Access user session from context
  const [highlightedItem, setHighlightedItem] = useState(null);

  // Add handler for quantity changes
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(itemId, newQuantity);
    } else if (newQuantity === 0) {
      // Remove item if quantity would be 0
      removeFromCart(itemId);
    }
  };

  // When cart opens or a new item is added, highlight that item
  useEffect(() => {
    if (open && lastAddedItem) {
      setHighlightedItem(lastAddedItem.id);

      // Remove highlight after 2 seconds
      const timer = setTimeout(() => {
        setHighlightedItem(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [open, lastAddedItem]);

  if (!open) return null; // Don't render if overlay is closed

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const shippingFee = 0; // Example static shipping fee
  const total = subtotal + shippingFee;

  const handleCheckoutClick = () => {
    navigate("/checkout", {
      state: {
        cartItems,
        subtotal,
        shippingFee,
        total,
      },
    });
    onClose(); // Close the overlay when navigating to checkout
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 50,
        right: isMobile ? 0 : 20,
        width: "400px",
        backgroundColor: "white",
        boxShadow: "-2px 0 5px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        zIndex: 1000,
        borderRadius: "8px",
        maxHeight: "80vh",
        animation: "slideIn 0.3s ease-out",
        "@keyframes slideIn": {
          "0%": { transform: "translateX(100%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
      }}
      className="Cart-popup"
    >
      {/* Header with Close Icon */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "8px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Typography variant="h6">Shopping Cart ({cartItems.length})</Typography>
        <CloseIcon
          sx={{ cursor: "pointer", fontSize: "24px", color: "#333" }}
          onClick={onClose}
        />
      </Box>

      {/* Cart Items List */}
      {cartItems.length === 0 ? (
        <Typography sx={{ textAlign: "center", marginTop: "20px" }}>
          Your cart is empty.
        </Typography>
      ) : (
        <>
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              marginTop: "10px",
              maxHeight: "50vh",
            }}
          >
            {cartItems.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #eee",
                  backgroundColor:
                    highlightedItem === item.id
                      ? "rgba(107, 123, 88, 0.1)"
                      : "transparent",
                  transition: "background-color 0.3s ease",
                  position: "relative",
                  borderRadius: "4px",
                }}
              >
                {/* New Item Indicator */}
                {highlightedItem === item.id && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      backgroundColor: "#6B7B58",
                      color: "white",
                      fontSize: "10px",
                      padding: "2px 6px",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 14 }} />
                    <span>Added</span>
                  </Box>
                )}

                {/* Left: Image and details */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <img
                    src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${item.image}`}
                    alt={item.name}
                    width="120"
                    height="100"
                    style={{
                      borderRadius: "5px",
                      transition: "transform 0.3s ease",
                      transform:
                        highlightedItem === item.id
                          ? "scale(1.05)"
                          : "scale(1)",
                      width: "50%",
                      height: "110px",
                    }}
                  />

                  {/* Right: Name, Price, and Quantity controls */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "Horizon",
                        fontSize: "0.8rem !important",
                        fontWeight:
                          highlightedItem === item.id ? "bold" : "normal",
                      }}
                    >
                      {item.name}
                    </Typography>

                    {/* Quantity controls */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        marginTop: "4px",
                        marginBottom: "4px",
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          item.quantity === 1
                            ? removeFromCart(item.id)
                            : handleQuantityChange(item.id, item.quantity - 1)
                        }
                        sx={{
                          padding: "2px",
                          backgroundColor:
                            item.quantity === 1 ? "transparent" : "#6B7B58",
                          color: "white",
                          "&:hover": {
                            backgroundColor:
                              item.quantity === 1 ? "#2d2d2d" : "#5a6a47",
                            cursor: item.quantity === 1 ? "pointer" : "pointer",
                          },
                          width: "20px",
                          height: "20px",
                          minWidth: "20px",
                        }}
                      >
                        {item.quantity === 1 ? (
                          <DeleteIcon fontSize="small" color="#ccc" />
                        ) : (
                          <RemoveIcon fontSize="small" />
                        )}
                      </IconButton>

                      <Typography
                        sx={{
                          fontFamily: "Montserrat",
                          fontSize: "14px",
                          minWidth: "20px",
                          textAlign: "center",
                        }}
                      >
                        {item.quantity}
                      </Typography>

                      <IconButton
                        size="small"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        sx={{
                          padding: "2px",
                          backgroundColor: "#6B7B58",
                          color: "white",
                          "&:hover": { backgroundColor: "#5a6a47" },
                          width: "20px",
                          height: "20px",
                          minWidth: "20px",
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "#2d2d2d",
                        fontFamily: "Montserrat",
                        fontWeight: "bold",
                      }}
                    >
                      {` ${item.unitPrice.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} E£`}
                    </Typography>

                    {/* Existing color and size info... */}
                    {item.color && item.color !== "default" && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#6B7B58",
                          fontFamily: "Montserrat",
                          fontSize: "12px",
                        }}
                      >
                        Color: {item.color}
                      </Typography>
                    )}
                    {item.size && item.size !== "default" && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#6B7B58",
                          fontFamily: "Montserrat",
                          fontSize: "12px",
                        }}
                      >
                        Size: {item.size}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Remove Button */}
                <CancelIcon
                  onClick={() => removeFromCart(item.id)}
                  sx={{
                    cursor: "pointer",
                    color: "#999",
                    "&:hover": {
                      color: "#f44336",
                    },
                    marginRight: highlightedItem === item.id ? "30px" : "0",
                  }}
                />
              </Box>
            ))}
          </Box>

          {/* Total Price Section */}
          <Box
            sx={{
              paddingTop: "10px",
              paddingBottom: "10px",
              borderTop: "1px solid #ddd",
              textAlign: "left",
            }}
          >
            <Typography sx={{ fontFamily: "Montserrat", fontSize: "18px" }}>
              {`Total: ${total.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} E£`}
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: "10px" }}>
            {/* Checkout Button */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                marginTop: "10px",
                fontFamily: "Horizon",
                backgroundColor: "#6B7B58",
                "&:hover": {
                  backgroundColor: "#5a6a47",
                },
              }}
              onClick={
                userSession ? handleCheckoutClick : () => navigate("/login")
              }
            >
              Checkout
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ShoppingCartOverlay;
