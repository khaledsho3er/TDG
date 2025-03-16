import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

const detectCardType = (number) => {
  const firstDigit = number.charAt(0);
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
    .replace(/\D/g, "")
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
  const [cardType, setCardType] = useState("Visa");
  const [cvv, setCvv] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  useEffect(() => {
    if (card) {
      setCardNumber(card.cardNumber || "");
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
      setCardNumber(formatCardNumber(rawValue));
      setCardType(detectCardType(rawValue));
    }
  };

  const handleSave = async () => {
    if (!userId) {
      alert("User ID is missing. Please log in.");
      return;
    }

    const cardData = {
      userId,
      cardNumber: cardNumber.replace(/\s/g, ""),
      expiryDate,
      defaultCard,
    };

    try {
      const response = await axios.post("/api/cards/add", cardData);
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
          onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))} // Only numbers
          margin="normal"
          placeholder="***"
          inputProps={{ maxLength: 4 }}
        />
        <TextField
          label="Expiry Date"
          variant="outlined"
          fullWidth
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          margin="normal"
          placeholder="MM/YY"
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
