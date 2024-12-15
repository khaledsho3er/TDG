import { Box, FormControlLabel, Checkbox } from "@mui/material";
import React from "react";
import { useCart } from "../../Context/cartcontext"; // Import CartContext
import PaymentIcons from "../paymentsIcons";

function SummaryForm() {
  const { cartItems } = useCart(); // Get cart items from context

  // Calculate subtotal, shipping, and total
  const subtotal = cartItems.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );
  const shipping = 600; // Example fixed shipping cost
  const total = subtotal + shipping;

  return (
    <Box className="Ordersummary-bigcontainer">
      {/* First Row */}
      <Box className="Ordersummary-firstrow">
        {/* Product Details */}
        <Box className="Ordersummary-firstrow-firstcolumn">
          <Box className="product-details">
            <Box className="product-header">
              <span>Product</span>
              <span>Unit Price</span>
              <span>Qty.</span>
              <span>Total Price</span>
            </Box>
            <Box className="product-content">
              {cartItems.map((product) => (
                <Box className="product-row" key={product.id}>
                  <Box className="product-info">
                    <h4 className="product-title">{product.name}</h4>
                    <p className="product-description">{product.description}</p>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                    />

                    <p>Color: {product.color}</p>
                    <p>Size: {product.size}</p>
                  </Box>

                  <span className="unit-price">{product.unitPrice} LE</span>
                  <span className="quantity">{product.quantity}</span>
                  <span className="total-price">
                    {(product.unitPrice * product.quantity).toLocaleString()} LE
                  </span>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Shipping Details */}
          <Box className="shipping-details">
            <ul>
              <li>Shipping to Egypt</li>
              <li>Ship in 1-2 weeks</li>
              <li>
                Sold and shipped by <strong>Our Company</strong>
              </li>
            </ul>
          </Box>
        </Box>

        {/* Cart Summary */}
        <Box className="Ordersummary-firstrow-secondcolumn">
          <Box className="ordersummary-total">
            <h1 className="ordersummary-cart-title">Your Cart</h1>
            <div className="ordersummary-cart-summary-row">
              <span>Subtotal:</span>
              <span>{subtotal.toLocaleString()} LE</span>
            </div>
            <div className="ordersummary-cart-summary-row">
              <span>Shipping:</span>
              <span>{shipping.toLocaleString()} LE</span>
            </div>
            <div className="ordersummary-cart-summary-total">
              <span>Total:</span>
              <span>{total.toLocaleString()} LE</span>
            </div>
          </Box>
          <Box className="Ordersummary-firstrow-secondcolumn-secondrow">
            <PaymentIcons />
          </Box>
        </Box>
      </Box>

      {/* Terms and Conditions */}
      <Box className="Ordersummary-thirdrow">
        <FormControlLabel
          control={<Checkbox />}
          label="I have read and accept the terms and conditions."
          sx={{
            display: "flex",
            alignItems: "center",
            columnGap: "16px",
            paddingLeft: "20px",
            "& .MuiFormControlLabel-label": {
              fontFamily: "Montserrat, san-serif",
              fontSize: "13px",
              color: "#333",
              textAlign: "left",
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default SummaryForm;
