import React, { useContext } from "react";
import { Box, Typography, Button, useMediaQuery } from "@mui/material";
import { useCart } from "../../Context/cartcontext";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";
import { UserContext } from "../../utils/userContext";

const ShoppingCartOverlay = ({ open, onClose }) => {
  const { cartItems, removeFromCart } = useCart(); // Use cartItems from context
  const isMobile = useMediaQuery("(max-width:768px)");
  const navigate = useNavigate();
  const { userSession } = useContext(UserContext); // Access user session from context
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
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 50,
        right: isMobile ? 0 : 20,
        width: "360px",
        backgroundColor: "white",
        boxShadow: "-2px 0 5px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        zIndex: 1000,
        borderRadius: "8px",
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
        <Typography variant="h6">Shopping Cart</Typography>
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
          <Box sx={{ flexGrow: 1, overflowY: "auto", marginTop: "10px" }}>
            {cartItems.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                {/* Left: Image */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <img
                    src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${item.image}`}
                    alt={item.name}
                    width="120"
                    height="100"
                    style={{ borderRadius: "5px" }}
                  />

                  {/* Right: Name & Price */}
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{ fontFamily: "Montserrat" }}
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "gray", fontFamily: "Montserrat" }}
                    >
                      {`${item.quantity} x  ${item.unitPrice.toFixed(2)}LE`}
                    </Typography>
                  </Box>
                </Box>

                {/* Remove Button */}

                <CancelIcon onClick={() => removeFromCart(item.id)} />
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
              {`Total: ${total.toFixed(2)}LE`}
            </Typography>
          </Box>

          {/* Checkout Button */}
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: "10px", fontFamily: "Horizon" }}
            onClick={
              userSession ? handleCheckoutClick : () => navigate("/login")
            } // Use the corrected function
          >
            Checkout
          </Button>
        </>
      )}
    </Box>
  );
};

export default ShoppingCartOverlay;
