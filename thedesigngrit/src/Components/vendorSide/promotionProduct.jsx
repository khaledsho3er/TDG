import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const PromotionModal = ({ open, onClose, onSave, product }) => {
  const [price, setPrice] = useState(product.price);
  const [salePrice, setSalePrice] = useState(product.salePrice || "");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [useDateRange, setUseDateRange] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Calculate discount percentage dynamically
  const handleSalePriceChange = (value) => {
    setSalePrice(value);
    if (price) {
      const discount = ((price - value) / price) * 100;
      setDiscountPercentage(discount.toFixed(2));
    }
  };

  const handleSave = () => {
    const promotionDetails = {
      price,
      salePrice,
      discountPercentage,
      useDateRange,
      startDate: useDateRange ? startDate : null,
      endDate: useDateRange ? endDate : null,
    };
    onSave(promotionDetails);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} sx={{ backdropFilter: "blur(5px)" }}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          backdropFilter: "blur(12px)",
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
          Create Promotion
        </h3>
        <TextField
          fullWidth
          label="Original Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Sale Price"
          type="number"
          value={salePrice}
          onChange={(e) => handleSalePriceChange(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Discount Percentage"
          type="text"
          value={`${discountPercentage}%`}
          InputProps={{ readOnly: true }}
          sx={{ mb: 2 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={useDateRange}
              onChange={(e) => setUseDateRange(e.target.checked)}
            />
          }
          label="Enable Promotion Date Range"
        />
        {useDateRange && (
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              type="date"
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
            />
            <TextField
              type="date"
              label="End Date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
            />
          </Box>
        )}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <button className="promotion-cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="promotion-save-button" onClick={handleSave}>
            Save
          </button>
        </Box>
      </Box>
    </Modal>
  );
};
export default PromotionModal;
