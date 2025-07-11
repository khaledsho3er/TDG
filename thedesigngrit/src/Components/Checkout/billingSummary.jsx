import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import PaymentIcons from "../paymentsIcons";

function BillSummary({ cartItems }) {
  // Calculate subtotal, VAT, shipping, and total
  const subtotal = cartItems.reduce(
    (total, item) =>
      total + (item.unitPrice || item.salePrice || 0) * (item.quantity || 1),
    0
  );

  const vatRate = 0.14;
  const vatAmount = Math.round(subtotal * vatRate);
  const shipping = 100;
  const total = subtotal + vatAmount + shipping;

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
              background: "#6c7b58",
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#2d2d2d",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#2d2d2d",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#2d2d2d",
            },
          }}
        >
          {cartItems.map((item, index) => (
            <Box key={index} className="ordersummary-cart-item">
              {/* <img
                src={
                  `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${item.image}` ||
                  `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${item.mainImage}`
                }
                alt={item.name}
                className="ordersummary-cart-item-image"
              /> */}

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
                      {item.unitPrice.toLocaleString()} E£
                    </Typography>
                    <Typography variant="body1" style={{ color: "red" }}>
                      {item.salePrice.toLocaleString()} E£
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body1">
                    {item.unitPrice.toLocaleString()} E£
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
          <span>{subtotal.toLocaleString()} E£</span>
        </div>
        <div className="ordersummary-cart-summary-row">
          <span>VAT (14%):</span>
          <span>{vatAmount.toLocaleString()} E£</span>
        </div>
        <div className="ordersummary-cart-summary-row">
          <span>Shipping:</span>
          <span>{shipping.toLocaleString()} E£</span>
        </div>
        <div className="ordersummary-cart-summary-total">
          <span>Total:</span>
          <span>{total.toLocaleString()} E£</span>
        </div>
      </Box>

      <Box className="Ordersummary-firstrow-secondcolumn-secondrow">
        <PaymentIcons />
      </Box>
    </Box>
  );
}

export default BillSummary;
