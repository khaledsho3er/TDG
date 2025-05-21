// BillSummary.js
import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import PaymentIcons from "../paymentsIcons";

function BillSummary({ cartItems }) {
  // Calculate subtotal, shipping, and total
  const subtotal = cartItems.reduce(
    (total, item) => total + (item.salePrice || item.unitPrice) * item.quantity,
    0
  );
  const shipping = 100; // Example fixed shipping cost
  const total = subtotal + shipping;

  return (
    <Box className="Ordersummary-firstrow-secondcolumn">
      <Box className="ordersummary-total">
        <h1 className="ordersummary-cart-title">Your Cart</h1>

        {/* Cart Items List - Scrollable */}
        <Box
          className="ordersummary-cart-items"
          sx={{
            maxHeight: "140px",
            overflowY: "auto",
            marginBottom: "16px",
            padding: "0 5px",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#fff",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#fff",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#fff",
            },
          }}
        >
          {cartItems.map((item, index) => (
            <Box key={index} className="ordersummary-cart-item">
              {/* Product Image */}
              <img
                src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${item.image}`}
                alt={item.name}
                className="ordersummary-cart-item-image"
              />

              <Box className="ordersummary-cart-item-details">
                <Typography
                  variant="body1"
                  className="ordersummary-cart-item-name"
                >
                  {item.name}
                </Typography>
                <Typography
                  variant="body2"
                  className="ordersummary-cart-item-quantity"
                >
                  Qty: {item.quantity}
                </Typography>
              </Box>

              <Box className="ordersummary-cart-item-price">
                {item.salePrice ? (
                  <>
                    <Typography
                      variant="body2"
                      style={{
                        textDecoration: "line-through",
                        color: "#999",
                        marginRight: "8px",
                      }}
                    >
                      {item.unitPrice.toLocaleString()} LE
                    </Typography>
                    <Typography variant="body1" style={{ color: "red" }}>
                      {item.salePrice.toLocaleString()} LE
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body1">
                    {item.unitPrice.toLocaleString()} LE
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Box>

        <Divider
          style={{ margin: "16px 0", color: "#fff", background: "#fff" }}
        />

        {/* Summary Totals */}
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
  );
}

export default BillSummary;
