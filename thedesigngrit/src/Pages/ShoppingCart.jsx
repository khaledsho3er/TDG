import React, { useState, useEffect } from "react";
import Header from "../Components/navBar";
import Footer from "../Components/Footer";
import PaymentIcons from "../Components/paymentsIcons";
import { Box, Typography, Button } from "@mui/material";
import { FaRegTrashAlt } from "react-icons/fa";
import { useCart } from "../Context/cartcontext";
import { useNavigate } from "react-router-dom";

function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]); // Define cartItems state
  const { cartItems: contextCartItems, removeFromCart } = useCart();

  // Calculate Subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );

  // Use contextCartItems as default state
  useEffect(() => {
    setCartItems(contextCartItems);
  }, [contextCartItems]);

  const updateItemQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) return; // Avoid quantity less than 1

    // Update the cart items in local state
    const updatedCartItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );

    // Set the updated cart items in state
    setCartItems(updatedCartItems);

    // Sync with localStorage
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

  // Fixed Shipping Fee
  const shippingFee = 600;

  const navigate = useNavigate(); // Initialize navigate function

  const handleCheckoutClick = () => {
    navigate("/checkout"); // Navigate to /checkout when the button is clicked
  };

  const handleContinueClick = () => {
    navigate("/products");
  };

  return (
    <div className="Shopping-cart">
      <Header />
      <Box className="Shopping-cart-title">
        <h2>My Cart</h2>
      </Box>
      <Box className="Shopping-cart-body">
        {/* Left Side: Table */}
        <Box className="Shopping-cart-table">
          {/* Table Header */}
          <Box className="cart-header">
            <Typography>Items</Typography>
            <Typography>Unit Price</Typography>
            <Typography>Quantity</Typography>
            <Typography>Price</Typography>
          </Box>

          {/* Table Rows (Dynamic) */}
          {cartItems.map((item) => (
            <Box className="cart-item" key={item.id}>
              <Box className="item-details">
                <img src={item.image} alt={item.name} className="item-image" />
                <Box>
                  <Typography sx={{ fontFamily: "Montserrat" }}>
                    {item.brand}
                  </Typography>
                  <Typography className="item-title">{item.name}</Typography>
                  <Typography className="item-info">
                    Color: {item.color}
                  </Typography>
                  <Typography className="item-info">
                    Size: {item.size}
                  </Typography>
                  <Typography className="item-info">
                    Code: {item.code}
                  </Typography>
                </Box>
              </Box>
              <Typography className="unit-price">
                {item.unitPrice.toLocaleString()} LE
              </Typography>
              <Box className="quantity">
                <Button
                  onClick={() => updateItemQuantity(item.id, item.quantity - 1)} // Decrease quantity
                  className="quantity-button"
                  disabled={item.quantity <= 1} // Disable if quantity is less than or equal to 1
                >
                  -
                </Button>
                <Typography className="quantity">{item.quantity}</Typography>
                <Button
                  onClick={() => updateItemQuantity(item.id, item.quantity + 1)} // Increase quantity
                  className="quantity-button"
                >
                  +
                </Button>
              </Box>
              <Box className="price-container">
                <Typography className="price">
                  {(item.unitPrice * item.quantity).toLocaleString()} LE
                </Typography>
              </Box>
              <Box className="delete-icon">
                <FaRegTrashAlt
                  onClick={() => removeFromCart(item.id)} // Remove item from cart
                  style={{ cursor: "pointer" }}
                />
              </Box>
            </Box>
          ))}

          {/* Actions */}
          <Box className="cart-actions">
            <Button className="continue-button" onClick={handleContinueClick}>
              Continue Shopping
            </Button>
            <Button className="checkout-button" onClick={handleCheckoutClick}>
              Checkout
            </Button>
          </Box>
        </Box>

        {/* Right Side: Summary */}
        <Box className="Shopping-cart-bill-section">
          <Box className="cart-summary">
            <Typography className="summary-title">YOUR CART</Typography>
            <Box className="summary-item">
              <Typography>Subtotal:</Typography>
              <Typography>{subtotal.toLocaleString()} LE</Typography>
            </Box>
            <Box className="summary-item">
              <Typography>Shipping:</Typography>
              <Typography>{shippingFee} LE</Typography>
            </Box>
            <Box className="summary-item total">
              <Typography>Total:</Typography>
              <Typography>
                {(subtotal + shippingFee).toLocaleString()} LE
              </Typography>
            </Box>
          </Box>
          <PaymentIcons />
        </Box>
      </Box>
      <Footer />
    </div>
  );
}

export default ShoppingCart;
