import { Box, FormControlLabel, Checkbox, Typography } from "@mui/material";
import React from "react";
import { useCart } from "../../Context/cartcontext"; // Import CartContext
import BillSummary from "./billingSummary"; // Assuming you have a BillSummary component
import { Link } from "react-router-dom";
function SummaryForm({ billData }) {
  const { cartItems } = useCart(); // Get cart items from context
  const { subtotal, shippingFee, total } = billData;

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
        <BillSummary
          cartItems={cartItems}
          subtotal={subtotal}
          shippingFee={shippingFee}
          total={total}
        />
      </Box>

      {/* Terms and Conditions */}
      <Box className="Ordersummary-thirdrow">
        <FormControlLabel
          control={<Checkbox />}
          label={
            <Typography
              variant="body2"
              component="span"
              sx={{
                display: "flex",
                alignItems: "center",
                columnGap: "4px",
                fontFamily: "Montserrat",
                fontSize: "13px",
                "& a": {
                  textDecoration: "underline",
                  color: "#2962ff",
                },
              }}
            >
              I have read and accept the{" "}
              <a
                href="/policy?section=Full Terms of Service Agreement"
                target="_blank"
                rel="noopener noreferrer"
              >
                terms and conditions
              </a>
              .
            </Typography>
          }
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
