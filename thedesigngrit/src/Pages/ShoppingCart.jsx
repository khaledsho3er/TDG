import React, { useState } from "react";
import Header from "../Components/navBar";
import Footer from "../Components/Footer";
import PaymentIcons from "../Components/paymentsIcons";
import { Box, Typography, Button } from "@mui/material";
import { FaRegTrashAlt } from "react-icons/fa";

function ShoppingCart() {
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
  />;

  const [products, setProducts] = useState([
    {
      id: 1,
      brand: "Assets/PartnersLogos/istikbal.png",
      name: "2 FABRIC SOFA",
      color: "Beige",
      size: "36 x 34 x 32",
      code: "1234544572KM",
      image: "Assets/sofabrown.jpg",
      unitPrice: 32000,
      quantity: 1,
    },
    {
      id: 2,
      brand: "Assets/PartnersLogos/istikbal.png",
      name: "BATH TUB CERAMIC",
      color: "Beige",
      size: "36 x 34 x 32",
      code: "1234544572KM",
      image: "Assets/sofabrown.jpg",
      unitPrice: 32000,
      quantity: 1,
    },
  ]);

  // Update quantity for a product
  const handleQuantityChange = (id, increment) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? {
              ...product,
              quantity: Math.max(1, product.quantity + increment), // Ensure quantity is at least 1
            }
          : product
      )
    );
  };

  // Delete product from the cart
  const handleDeleteProduct = (id) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );
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
          {products.map((product) => (
            <Box className="cart-item" key={product.id}>
              <Box className="item-details">
                <img
                  src={product.image}
                  alt={product.name}
                  className="item-image"
                />
                <Box>
                  <img
                    src={product.brand}
                    alt={product.name}
                    className="item-image-brand"
                  />
                  <Typography className="item-title">{product.name}</Typography>
                  <Typography className="item-info">
                    Color: {product.color}
                  </Typography>
                  <Typography className="item-info">
                    Size: {product.size}
                  </Typography>
                  <Typography className="item-info">
                    Code: {product.code}
                  </Typography>
                </Box>
              </Box>
              <Typography className="unit-price">
                {product.unitPrice.toLocaleString()} LE
              </Typography>
              <Box className="quantity">
                <Button
                  onClick={() => handleQuantityChange(product.id, -1)}
                  className="quantity-button"
                >
                  -
                </Button>
                <Typography className="quantity">{product.quantity}</Typography>
                <Button
                  onClick={() => handleQuantityChange(product.id, 1)}
                  className="quantity-button"
                >
                  +
                </Button>
              </Box>
              <Box className="price-container">
                <Typography className="price">
                  {(product.unitPrice * product.quantity).toLocaleString()} LE
                </Typography>
              </Box>
              <Box className="delete-icon">
                <FaRegTrashAlt
                  onClick={() => handleDeleteProduct(product.id)}
                  style={{ cursor: "pointer" }}
                />
              </Box>
            </Box>
          ))}

          {/* Actions */}
          <Box className="cart-actions">
            <Button className="continue-button">Continue Shopping</Button>
            <Button className="checkout-button">Checkout</Button>
          </Box>
        </Box>

        {/* Right Side: Summary */}
        <Box className="Shopping-cart-bill-section">
          <Box className="cart-summary">
            <Typography className="summary-title">YOUR CART</Typography>
            <Box className="summary-item">
              <Typography>Subtotal:</Typography>
              <Typography>
                {products
                  .reduce(
                    (total, product) =>
                      total + product.unitPrice * product.quantity,
                    0
                  )
                  .toLocaleString()}{" "}
                LE
              </Typography>
            </Box>
            <Box className="summary-item">
              <Typography>Shipping:</Typography>
              <Typography>600 LE</Typography>
            </Box>
            <Box className="summary-item total">
              <Typography>Total:</Typography>
              <Typography>
                {(
                  products.reduce(
                    (total, product) =>
                      total + product.unitPrice * product.quantity,
                    0
                  ) + 600
                ).toLocaleString()}{" "}
                LE
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
