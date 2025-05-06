import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Grid,
} from "@mui/material";

export default function VariantDialog({ open, onClose, onSubmit, sku }) {
  const [formData, setFormData] = useState({
    sku: sku || "",
    title: "",
    color: "",
    size: "",
    price: "",
    dimensions: "",
  });

  // Reset form when opened
  React.useEffect(() => {
    if (open) {
      setFormData({
        sku: sku || "",
        title: "",
        color: "",
        size: "",
        price: "",
        dimensions: "",
      });
    }
  }, [open, sku]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.sku) {
      alert("Missing SKU");
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Product Variant</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              name="title"
              fullWidth
              value={formData.title}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Color"
              name="color"
              fullWidth
              value={formData.color}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Size"
              name="size"
              fullWidth
              value={formData.size}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Price"
              name="price"
              type="number"
              fullWidth
              value={formData.price}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Dimensions"
              name="dimensions"
              fullWidth
              value={formData.dimensions}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save Variant
        </Button>
      </DialogActions>
    </Dialog>
  );
}
