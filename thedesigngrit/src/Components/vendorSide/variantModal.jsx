import React, { useState } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const VariantsModal = ({ open, onClose, onSubmit }) => {
  const [variantData, setVariantData] = useState({
    color: "",
    material: "",
    size: "",
    price: "",
    salePrice: "",
    sku: "",
    leadTime: "",
    mainImage: "",
    images: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVariantData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const fileArray = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );

    setVariantData((prevData) => ({
      ...prevData,
      [name]: fileArray,
    }));
  };

  const handleSubmit = () => {
    onSubmit(variantData);
    setVariantData({
      color: "",
      material: "",
      size: "",
      price: "",
      salePrice: "",
      sku: "",
      leadTime: "",
      mainImage: "",
      images: [],
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
        }}
      >
        <h2>Add Product Variant</h2>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Color"
                fullWidth
                name="color"
                value={variantData.color}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Material"
                fullWidth
                name="material"
                value={variantData.material}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Size"
                fullWidth
                name="size"
                value={variantData.size}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Price"
                fullWidth
                name="price"
                type="number"
                value={variantData.price}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Sale Price"
                fullWidth
                name="salePrice"
                type="number"
                value={variantData.salePrice}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="SKU"
                fullWidth
                name="sku"
                value={variantData.sku}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Lead Time"
                fullWidth
                name="leadTime"
                value={variantData.leadTime}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Main Image</InputLabel>
                <Select
                  name="mainImage"
                  value={variantData.mainImage}
                  onChange={handleChange}
                  label="Main Image"
                >
                  {variantData.images.map((img, index) => (
                    <MenuItem key={index} value={img}>
                      Image {index + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <input
                type="file"
                multiple
                name="images"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Grid>
          </Grid>

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={onClose} variant="outlined" color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Save Variant
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default VariantsModal;
