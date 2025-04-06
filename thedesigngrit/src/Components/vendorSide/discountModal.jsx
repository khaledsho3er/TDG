import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
const DiscountModal = ({
  open,
  onClose,
  onSave,
  product,
  isUpdate = false,
}) => {
  const [price, setPrice] = useState(product.price);
  const [salePrice, setSalePrice] = useState(product.salePrice || "");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [useDateRange, setUseDateRange] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState({}); // State for error messages

  // When user enters a discount percentage, calculate sale price
  const handleDiscountChange = (value) => {
    setDiscountPercentage(value);

    if (price && value) {
      const discountedPrice = price - (price * value) / 100;
      setSalePrice(discountedPrice.toFixed(2)); // Round to 2 decimal places
    } else {
      setSalePrice("");
    }
  };

  // When user enters a sale price, calculate discount percentage
  const handleSalePriceChange = (value) => {
    setSalePrice(value);

    if (price && value) {
      const discount = ((price - value) / price) * 100;
      setDiscountPercentage(discount.toFixed(2)); // Round to 2 decimal places
    } else {
      setDiscountPercentage("");
    }
  };

  // Validate fields
  const validateFields = () => {
    let errors = {};

    if (!salePrice) {
      errors.salePrice = "Sale price is required.";
    } else if (salePrice >= price) {
      errors.salePrice = "Sale price must be lower than the original price.";
    }

    if (useDateRange) {
      if (!startDate) {
        errors.startDate = "Start date is required.";
      }
      if (!endDate) {
        errors.endDate = "End date is required.";
      }
      if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
        errors.dateRange = "Start date must be before the end date.";
      }
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    const promotionDetails = {
      salePrice,
      discountPercentage,
      startDate,
      endDate,
    };

    try {
      const apiUrl = isUpdate
        ? `https://tdg-db.onrender.com/api/promotions/update/${product._id}` // Update promotion
        : `https://tdg-db.onrender.com/api/promotions/create/${product._id}`; // Create promotion

      const response = await fetch(apiUrl, {
        method: "PUT", // Use PUT for both update and create in your backend
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promotionDetails),
      });

      if (!response.ok) throw new Error("Failed to save promotion");

      const data = await response.json();
      console.log("Promotion saved:", data);
      onSave(data.product); // Send updated product data back to the parent
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error saving promotion:", error);
    }
  };

  // For update mode, prepopulate dates
  useEffect(() => {
    if (isUpdate && product.salePrice) {
      setSalePrice(product.salePrice);
      setDiscountPercentage(product.discountPercentage);
      setStartDate(product.promotionStartDate);
      setEndDate(product.promotionEndDate);
      setUseDateRange(true); // Ensure date range is enabled in update mode
    }
  }, [isUpdate, product]);

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
          {isUpdate ? "Update Promotion" : "Create Promotion"}
        </h3>
        <TextField
          fullWidth
          label="Original Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          sx={{ mb: 2 }}
          disabled={isUpdate} // Disable for updates
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
          error={!!errors.discountPercentage}
          helperText={errors.discountPercentage}
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

export default DiscountModal;
