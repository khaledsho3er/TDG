import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

const BillingInfoPopup = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");

  const handleSave = () => {
    // Add your save billing information logic here
    console.log("Saving billing information...");
  };

  const handleCancel = () => {
    // Add your cancel logic here
    console.log("Canceling billing information update...");
  };
  return (
    <Box className="billing-info-content">
      <div className="billing-form-field">
        <label>Card Number</label>
        <input
          type="text"
          variant="outlined"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          fullWidth
          margin="normal"
        />
      </div>
      <div className="billing-form-field">
        <label>Cardholder Name</label>
        <input
          type="text"
          variant="outlined"
          value={cardHolder}
          onChange={(e) => setCardHolder(e.target.value)}
          fullWidth
          margin="normal"
        />
      </div>
      <div className="billing-form-field-row">
        <div className="billing-form-field-cvv">
          <label>CVV</label>
          <input
            type="text"
            variant="outlined"
            placeholder="***"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
          />
        </div>
        <div className="billing-form-field">
          <label>Expiry Date</label>
          <div className="billing-expiry-date">
            <input
              type="text"
              variant="outlined"
              value={expiryMonth}
              onChange={(e) => setExpiryMonth(e.target.value)}
              placeholder="MM"
            />
            <input
              type="text"
              variant="outlined"
              value={expiryYear}
              onChange={(e) => setExpiryYear(e.target.value)}
              placeholder="YY"
            />
          </div>
        </div>
      </div>

      <div className="reset-popup-buttons">
        <button className="reset-popUpForm-btn-save" onClick={handleSave}>
          Save
        </button>
        <button className="reset-popUpForm-btn-cancel" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </Box>
  );
};

export default BillingInfoPopup;
