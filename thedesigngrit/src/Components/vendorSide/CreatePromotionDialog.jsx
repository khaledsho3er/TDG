import React, { useState, useEffect } from "react";
import { Modal, Box, Button, TextField, Grid, Typography } from "@mui/material";
import axios from "axios";

const CreatePromotionDialog = ({
  open,
  onClose,
  brandId,
  onPromotionCreated,
}) => {
  const [step, setStep] = useState(1);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [salePrice, setSalePrice] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (brandId && open) {
      axios
        .get(
          `https://api.thedesigngrit.com/api/products/getproducts/brand/${brandId}`
        )
        .then((res) => setProducts(res.data))
        .catch((err) => console.error("Error loading products:", err));
    }
  }, [brandId, open]);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setStep(2);
  };

  const validateFields = () => {
    const errs = {};
    if (!salePrice) errs.salePrice = "Sale price is required.";
    else if (salePrice >= selectedProduct.price)
      errs.salePrice = "Sale price must be less than original.";
    if (!startDate) errs.startDate = "Start date is required.";
    if (!endDate) errs.endDate = "End date is required.";
    if (startDate && endDate && new Date(startDate) >= new Date(endDate))
      errs.dateRange = "Start date must be before end date.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) return;
    try {
      const res = await axios.put(
        `https://api.thedesigngrit.com/api/products/promotion/${selectedProduct._id}`,
        {
          salePrice,
          discountPercentage,
          startDate,
          endDate,
        }
      );
      onPromotionCreated(res.data.product);
      handleClose();
    } catch (err) {
      console.error("Failed to create promotion:", err);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedProduct(null);
    setSalePrice("");
    setDiscountPercentage("");
    setStartDate("");
    setEndDate("");
    setErrors({});
    onClose();
  };

  const calculateDiscountFromSale = (val) => {
    setSalePrice(val);
    if (selectedProduct?.price && val) {
      const disc =
        ((selectedProduct.price - val) / selectedProduct.price) * 100;
      setDiscountPercentage(disc.toFixed(2));
    }
  };

  const calculateSaleFromDiscount = (val) => {
    setDiscountPercentage(val);
    if (selectedProduct?.price && val) {
      const discounted =
        selectedProduct.price - (selectedProduct.price * val) / 100;
      setSalePrice(discounted.toFixed(2));
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{ backdropFilter: "blur(6px)" }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          height: step === 1 ? 700 : 400,
          overflow: "auto",
          transform: "translate(-50%, -50%)",
          width: step === 1 ? 700 : 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        {step === 1 ? (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Select a Product for Promotion
            </Typography>
            <Grid container spacing={2}>
              {products.map((prod) => (
                <Grid item xs={4} key={prod._id}>
                  <Box
                    onClick={() => handleSelectProduct(prod)}
                    sx={{
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "10px",
                      cursor: "pointer",
                      textAlign: "center",
                      "&:hover": { boxShadow: 3 },
                    }}
                  >
                    <img
                      src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${prod.mainImage}`}
                      alt={prod.name}
                      style={{
                        width: "100%",
                        height: 100,
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                    <Typography fontSize={14} fontWeight="bold" mt={1}>
                      {prod.name}
                    </Typography>
                    <Typography fontSize={12} color="gray">
                      E£ {prod.price}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <>
            <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
              Create Promotion for: {selectedProduct.name}
            </Typography>
            <TextField
              fullWidth
              label="Sale Price"
              type="number"
              value={salePrice}
              onChange={(e) => calculateDiscountFromSale(e.target.value)}
              error={!!errors.salePrice}
              helperText={errors.salePrice}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Discount Percentage"
              type="number"
              value={discountPercentage}
              onChange={(e) => calculateSaleFromDiscount(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              error={!!errors.startDate}
              helperText={errors.startDate}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              error={!!errors.endDate}
              helperText={errors.endDate}
              sx={{ mb: 2 }}
            />
            {errors.dateRange && (
              <p style={{ color: "red" }}>{errors.dateRange}</p>
            )}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button variant="outlined" onClick={() => setStep(1)}>
                Back
              </Button>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button variant="text" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleSave}>
                  Save
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default CreatePromotionDialog;
