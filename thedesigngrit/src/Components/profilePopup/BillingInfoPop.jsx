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

const BillingInfoPopup = ({ open, card, isAddingNew, onSave, onCancel }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardType, setCardType] = useState("Visa");
  const [cvv, setCvv] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  useEffect(() => {
    if (card) {
      setCardNumber(card.cardNumber || "");
      setCardType(card.cardType || "Visa");
    } else {
      setCardNumber("");
      setCardType("Visa");
    }
    setCvv("");
    setExpiryDate("");
  }, [card]);

  const handleSave = () => {
    onSave({ cardNumber, type: cardType });
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
          color: "white",
          paddingLeft: "16px",
        }}
      >
        {isAddingNew ? "Add New Payment Method" : "Edit Payment Method"}
      </DialogTitle>
      <DialogContent
        sx={{
          fontWeight: "bold",
          backgroundColor: "#ffffff",
          color: "white",
        }}
      >
        <TextField
          label="Card Number"
          variant="outlined"
          fullWidth
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          margin="normal"
          InputLabelProps={{
            style: { color: "#2d2d2d" },
          }}
          InputProps={{
            style: { color: "#2d2d2d" },
          }}
        />
        <TextField
          select
          label="Card Type"
          variant="outlined"
          fullWidth
          value={cardType}
          onChange={(e) => setCardType(e.target.value)}
          margin="normal"
          InputLabelProps={{
            style: { color: "#2d2d2d" },
          }}
          InputProps={{
            style: { color: "#2d2d2d" },
          }}
        >
          <MenuItem value="Visa">Visa</MenuItem>
          <MenuItem value="Mastercard">Mastercard</MenuItem>
          <MenuItem value="Valu">Valu</MenuItem>
          <MenuItem value="Sohoula">Sohoula</MenuItem>
          <MenuItem value="Sympl">Sympl</MenuItem>
        </TextField>
        <TextField
          label="CVV"
          variant="outlined"
          fullWidth
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          margin="normal"
          placeholder="***"
          InputLabelProps={{
            style: { color: "#2d2d2d" },
          }}
          InputProps={{
            style: { color: "#2d2d2d" },
          }}
        />
        <TextField
          label="Expiry Date"
          variant="outlined"
          fullWidth
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          margin="normal"
          placeholder="MM/YY"
          InputLabelProps={{
            style: { color: "#2d2d2d" },
          }}
          InputProps={{
            style: { color: "#2d2d2d" },
          }}
        />
      </DialogContent>
      <DialogActions
        sx={{
          fontWeight: "bold",
          backgroundColor: "#ffffff",
        }}
      >
        <Button
          onClick={onCancel}
          sx={{
            color: "#2d2d2d",
            border: "none",
            "&:hover": {
              backgroundColor: "transparent",
              border: "1px solid #6c7c59",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          sx={{
            color: "#2d2d2d",
            border: "none",
            "&:hover": {
              backgroundColor: "#6c7c59",
              border: "none",
            },
          }}
        >
          {isAddingNew ? "Add" : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BillingInfoPopup;
