import React, { useState, useEffect } from "react";
import Header from "../Components/navBar";
import Footer from "../Components/Footer";
import PaymentIcons from "../Components/paymentsIcons";
import { Box, Typography, Button } from "@mui/material";
import { FaRegTrashAlt } from "react-icons/fa";
import { useCart } from "../Context/cartcontext";
import { useNavigate } from "react-router-dom";

function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const { cartItems: contextCartItems, removeFromCart, updateCart } = useCart();
  const navigate = useNavigate();

  // Load contextCartItems when component mounts
  useEffect(() => {
    setCartItems(contextCartItems);
  }, [contextCartItems]);

  // Calculate Subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );

  // Fixed Shipping Fee
  const shippingFee = 600;

  const updateItemQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) return;

    const updatedCartItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

  const handleCheckoutClick = () => {
    // Save cart data to context before navigating
    updateCart(cartItems);

    // Log cart data before navigating
    console.log("Cart Data on Checkout:", {
      cartItems,
      subtotal,
      shippingFee,
      total: subtotal + shippingFee,
    });

    // Navigate to Checkout page with cart data
    navigate("/checkout", {
      state: {
        cartItems,
        subtotal,
        shippingFee,
        total: subtotal + shippingFee,
      },
    });
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
        <Box className="Shopping-cart-table">
          <Box className="cart-header">
            <Typography>Items</Typography>
            <Typography>Unit Price</Typography>
            <Typography>Quantity</Typography>
            <Typography>Price</Typography>
          </Box>

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
                  onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                  className="quantity-button"
                  disabled={item.quantity <= 1}
                >
                  -
                </Button>
                <Typography className="quantity">{item.quantity}</Typography>
                <Button
                  onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
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
                  onClick={() => removeFromCart(item.id)}
                  style={{ cursor: "pointer" }}
                />
              </Box>
            </Box>
          ))}

          <Box className="cart-actions">
            <Button className="continue-button" onClick={handleContinueClick}>
              Continue Shopping
            </Button>
            <Button className="checkout-button" onClick={handleCheckoutClick}>
              Checkout
            </Button>
          </Box>
        </Box>

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
