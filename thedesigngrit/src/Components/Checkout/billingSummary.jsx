// BillSummary.js
import React from "react";
import { Box } from "@mui/material";
import PaymentIcons from "../paymentsIcons";
function BillSummary({ cartItems }) {
  // Calculate subtotal, shipping, and total
  const subtotal = cartItems.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );
  const shipping = 600; // Example fixed shipping cost
  const total = subtotal + shipping;

  return (
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
  );
}

export default BillSummary;
