import React from "react";
import Header from "../Components/navBar";
import { Box, Typography, Button } from "@mui/material";
import { FaRegTrashAlt } from "react-icons/fa";
import Footer from "../Components/Footer";
// Products Data
const products = [
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
];

function ShoppingCart() {
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
              <div className="quantity">
                <Button>-</Button>
                <Typography>{product.quantity}</Typography>
                <Button>+</Button>
              </div>
              <Box className="price-container">
                <Typography className="price">
                  {(product.unitPrice * product.quantity).toLocaleString()} LE
                </Typography>
                {/* Delete Icon Below the Price */}
              </Box>
              <Box className="delete-icon">
                <FaRegTrashAlt />
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
          <Box className="payment-icons">
            <img src="Assets/visa-logo.png" alt="Visa" />
            <img src="Assets/mastercard-logo.png" alt="Vodafone" />
            <img src="Assets/valu-logo.png" alt="MasterCard" />
            <img src="Assets/saholoha-logo.png" alt="MasterCard" />
            <img src="Assets/halan-logo.png" alt="MasterCard" />
          </Box>
        </Box>
      </Box>
      <Footer />
    </div>
  );
}

export default ShoppingCart;
