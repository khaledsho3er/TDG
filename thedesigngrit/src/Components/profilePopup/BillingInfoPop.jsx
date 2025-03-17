import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";

const detectCardType = (number) => {
  if (/^4/.test(number)) return "Visa";
  if (/^5[1-5]/.test(number)) return "MasterCard";
  if (/^3[47]/.test(number)) return "Amex";
  if (/^6/.test(number)) return "Discover";
  if (/^5(0|6|7|8|9)/.test(number)) return "Valu"; // Custom for Valu
  return "Unknown";
};

// Format card number: "1234567812345678" → "1234 5678 1234 5678"
const formatCardNumber = (value) => {
  return value
    .replace(/\D/g, "") // Remove non-digits
    .slice(0, 16) // Limit to 16 digits
    .replace(/(\d{4})/g, "$1 ")
    .trim();
};

const BillingInfoPopup = ({
  open,
  card,
  isAddingNew,
  onSave,
  onCancel,
  userId,
}) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardType, setCardType] = useState("Unknown");
  const [cvv, setCvv] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [expiryError, setExpiryError] = useState("");

  useEffect(() => {
    if (card) {
      setCardNumber(formatCardNumber(card.cardNumber || ""));
      setCardType(card.cardType || "Unknown");
      setExpiryDate(card.expiryDate || "");
    } else {
      setCardNumber("");
      setCardType("Unknown");
      setExpiryDate("");
    }
    setCvv("");
  }, [card]);

  const handleCardNumberChange = (e) => {
    let rawValue = e.target.value.replace(/\s/g, ""); // Remove spaces
    if (/^\d*$/.test(rawValue)) {
      const formatted = formatCardNumber(rawValue);
      setCardNumber(formatted);
      setCardType(detectCardType(rawValue));
    }
  };

  const validateExpiryDate = (expiry) => {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/; // Matches MM/YY format
    if (!regex.test(expiry)) {
      return "Invalid format. Use MM/YY";
    }

    const [month, year] = expiry.split("/").map(Number);
    const currentYear = new Date().getFullYear() % 100; // Last two digits of year
    const currentMonth = new Date().getMonth() + 1; // Months are 0-based

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return "Card is expired";
    }

    return null; // Valid expiry date
  };

  const handleExpiryChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Allow only numbers
    if (value.length <= 4) {
      let formatted = value;
      if (value.length >= 2) {
        formatted = `${value.slice(0, 2)}/${value.slice(2)}`;
      }
      setExpiryDate(formatted);
      setExpiryError(validateExpiryDate(formatted));
    }
  };

  const handleSave = async () => {
    if (!userId) {
      alert("User ID is missing. Please log in.");
      return;
    }
    if (expiryError) {
      alert("Please enter a valid expiry date.");
      return;
    }
    if (cardNumber.replace(/\s/g, "").length !== 16) {
      alert("Card number must be 16 digits.");
      return;
    }
    if (cvv.length < 3 || cvv.length > 4) {
      alert("CVV must be 3 or 4 digits.");
      return;
    }

    const cardData = {
      userId,
      cardNumber: cardNumber.replace(/\s/g, ""),
      expiryDate,
    };

    try {
      const response = await axios.post(
        "https://tdg-db.onrender.com/api/cards/add",
        cardData
      );
      onSave(response.data.card); // Pass saved card to parent
      onCancel(); // Close modal
    } catch (error) {
      console.error(
        "Error saving card:",
        error.response?.data || error.message
      );
      alert("Failed to save card. Please try again.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      sx={{
        zIndex: 1000,
        position: "fixed",
        backdropFilter: "blur(4px)",
        "& .MuiPaper-root": {
          borderRadius: "16px",
          backdropFilter: "blur(5px)",
          backgroundColor: "#ffffff",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "normal",
          backgroundColor: "#ffffff",
          paddingLeft: "16px",
        }}
      >
        {isAddingNew ? "Add New Payment Method" : "Edit Payment Method"}
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: "#ffffff" }}>
        <TextField
          label="Card Number"
          variant="outlined"
          fullWidth
          value={cardNumber}
          onChange={handleCardNumberChange}
          margin="normal"
          placeholder="1234 5678 1234 5678"
          inputProps={{ maxLength: 19 }} // Account for spaces
        />
        <TextField
          label="Card Type"
          variant="outlined"
          fullWidth
          value={cardType}
          disabled
          margin="normal"
        />
        <TextField
          label="CVV"
          variant="outlined"
          fullWidth
          value={cvv}
          onChange={(e) =>
            setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
          } // Only numbers, limit 4
          margin="normal"
          placeholder="***"
          inputProps={{ maxLength: 4 }}
        />
        <TextField
          label="Expiry Date"
          variant="outlined"
          fullWidth
          value={expiryDate}
          onChange={handleExpiryChange}
          margin="normal"
          placeholder="MM/YY"
          inputProps={{ maxLength: 5 }}
          error={!!expiryError}
          helperText={expiryError}
        />
      </DialogContent>
      <DialogActions sx={{ backgroundColor: "#ffffff" }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave}>{isAddingNew ? "Add" : "Update"}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BillingInfoPopup;
