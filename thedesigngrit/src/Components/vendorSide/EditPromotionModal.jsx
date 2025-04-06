import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";

const EditPromotionModal = ({ open, onClose, product, onSave, onEnd }) => {
  const [price] = useState(product.price);
  const [salePrice, setSalePrice] = useState(product.salePrice || "");
  const [discountPercentage, setDiscountPercentage] = useState(
    product.discountPercentage || ""
  );
  const [useDateRange, setUseDateRange] = useState(
    !!product.promotionStartDate
  );
  const [startDate, setStartDate] = useState(product.promotionStartDate || "");
  const [endDate, setEndDate] = useState(product.promotionEndDate || "");
  const [errors, setErrors] = useState({});

  const handleDiscountChange = (value) => {
    setDiscountPercentage(value);
    if (price && value) {
      const discountedPrice = price - (price * value) / 100;
      setSalePrice(discountedPrice.toFixed(2));
    } else {
      setSalePrice("");
    }
  };

  const handleSalePriceChange = (value) => {
    setSalePrice(value);
    if (price && value) {
      const discount = ((price - value) / price) * 100;
      setDiscountPercentage(discount.toFixed(2));
    } else {
      setDiscountPercentage("");
    }
  };

  const validateFields = () => {
    let errors = {};

    if (!salePrice) {
      errors.salePrice = "Sale price is required.";
    } else if (salePrice >= price) {
      errors.salePrice = "Sale price must be lower than the original price.";
    }

    if (useDateRange) {
      if (!startDate) errors.startDate = "Start date is required.";
      if (!endDate) errors.endDate = "End date is required.";
      if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
        errors.dateRange = "Start date must be before end date.";
      }
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    const updatedData = {
      salePrice,
      discountPercentage,
      startDate: useDateRange ? startDate : null,
      endDate: useDateRange ? endDate : null,
    };

    try {
      const response = await fetch(
        ` https://tdg-db.onrender.com/api/products/promotion/${product._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );
      if (!response.ok) throw new Error("Failed to update promotion");

      const data = await response.json();
      onSave(data.product);
      onClose();
    } catch (error) {
      console.error("Error updating promotion:", error);
    }
  };

  const handleEndPromotion = async () => {
    try {
      const response = await fetch(
        `https://tdg-db.onrender.com/api/products/promotion/end/${product._id}`,
        {
          method: "PATCH",
        }
      );
      if (!response.ok) throw new Error("Failed to end promotion");

      onEnd(product._id);
      onClose();
    } catch (error) {
      console.error("Error ending promotion:", error);
    }
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
          Edit Promotion
        </h3>

        <TextField
          fullWidth
          label="Original Price"
          type="number"
          value={price}
          disabled
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Sale Price"
          type="number"
          value={salePrice}
          onChange={(e) => handleSalePriceChange(e.target.value)}
          error={!!errors.salePrice}
          helperText={errors.salePrice}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Discount Percentage"
          type="number"
          value={discountPercentage}
          onChange={(e) => handleDiscountChange(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={useDateRange}
              onChange={(e) => setUseDateRange(e.target.checked)}
            />
          }
          label="Enable Date Range"
        />
        {useDateRange && (
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              type="date"
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              error={!!errors.startDate}
              helperText={errors.startDate}
              fullWidth
            />
            <TextField
              type="date"
              label="End Date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              error={!!errors.endDate}
              helperText={errors.endDate}
              fullWidth
            />
          </Box>
        )}
        {errors.dateRange && <p style={{ color: "red" }}>{errors.dateRange}</p>}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button onClick={onClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEndPromotion} variant="outlined" color="error">
            End
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditPromotionModal;
