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
  const { cartItems: contextCartItems, removeFromCart } = useCart();

  // Use contextCartItems as default state
  useEffect(() => {
    setCartItems(contextCartItems);
  }, [contextCartItems]);

  // Calculate Subtotal Safely
  const subtotal = cartItems.reduce(
    (total, item) =>
      total + (item.unitPrice || item.price || 0) * (item.quantity || 1),
    0
  );

  // Fixed Shipping Fee
  const shippingFee = 600;

  const navigate = useNavigate();

  const handleCheckoutClick = () => {
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
                {(item.unitPrice || item.price || 0).toLocaleString()} E£
              </Typography>
              <Box className="quantity">
                <Button
                  onClick={() =>
                    setCartItems((prev) =>
                      prev.map((i) =>
                        i.id === item.id && i.quantity > 1
                          ? { ...i, quantity: i.quantity - 1 }
                          : i
                      )
                    )
                  }
                  className="quantity-button"
                  disabled={item.quantity <= 1}
                >
                  -
                </Button>
                <Typography className="quantity">{item.quantity}</Typography>
                <Button
                  onClick={() =>
                    setCartItems((prev) =>
                      prev.map((i) =>
                        i.id === item.id
                          ? { ...i, quantity: i.quantity + 1 }
                          : i
                      )
                    )
                  }
                  className="quantity-button"
                >
                  +
                </Button>
              </Box>
              <Box className="price-container">
                <Typography className="price">
                  {(
                    (item.unitPrice || item.price || 0) * (item.quantity || 1)
                  ).toLocaleString()}{" "}
                  E£
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
              <Typography>{subtotal.toLocaleString()} E£</Typography>
            </Box>
            <Box className="summary-item">
              <Typography>Shipping:</Typography>
              <Typography>{shippingFee} E£</Typography>
            </Box>
            <Box className="summary-item total">
              <Typography>Total:</Typography>
              <Typography>
                {(subtotal + shippingFee).toLocaleString()} E£
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
