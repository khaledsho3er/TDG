import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Grid,
  IconButton,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

export default function VariantDialog({ open, onClose, onSubmit, sku }) {
  const [variants, setVariants] = useState([
    {
      sku: sku || "",
      title: "",
      color: "",
      size: "",
      price: "",
      dimensions: "",
      images: [],
      mainImage: null,
    },
  ]);
  const [currentVariant, setCurrentVariant] = useState(0);
  const [imagePreviews, setImagePreviews] = useState([[]]);
  const [skuOptions, setSkuOptions] = useState([]);

  // Fetch SKUs when dialog opens
  useEffect(() => {
    if (open) {
      fetchSkus();
    }
  }, [open]);

  // Reset form when opened
  useEffect(() => {
    if (open) {
      setVariants([
        {
          sku: sku || "",
          title: "",
          color: "",
          size: "",
          price: "",
          dimensions: "",
          images: [],
          mainImage: null,
        },
      ]);
      setCurrentVariant(0);
      setImagePreviews([[]]);
    }
  }, [open, sku]);

  const fetchSkus = async () => {
    try {
      const response = await axios.get(
        "http://api.thedesigngrit.com/api/products/skus"
      );
      setSkuOptions(response.data);
    } catch (err) {
      console.error("Error fetching SKUs:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedVariants = [...variants];
    updatedVariants[currentVariant] = {
      ...updatedVariants[currentVariant],
      [name]: value,
    };
    setVariants(updatedVariants);
  };

  const handleSkuSelect = (e) => {
    const { value } = e.target;
    const updatedVariants = [...variants];
    updatedVariants[currentVariant] = {
      ...updatedVariants[currentVariant],
      sku: value,
    };
    setVariants(updatedVariants);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));

    const updatedVariants = [...variants];
    updatedVariants[currentVariant] = {
      ...updatedVariants[currentVariant],
      images: [...updatedVariants[currentVariant].images, ...files],
      mainImage: updatedVariants[currentVariant].mainImage || files[0],
    };

    const updatedPreviews = [...imagePreviews];
    updatedPreviews[currentVariant] = [
      ...updatedPreviews[currentVariant],
      ...previews,
    ];

    setVariants(updatedVariants);
    setImagePreviews(updatedPreviews);
  };

  const handleSetMainImage = (index) => {
    const updatedVariants = [...variants];
    updatedVariants[currentVariant] = {
      ...updatedVariants[currentVariant],
      mainImage: updatedVariants[currentVariant].images[index],
    };
    setVariants(updatedVariants);
  };

  const handleRemoveImage = (index) => {
    const updatedVariants = [...variants];
    const updatedImages = updatedVariants[currentVariant].images.filter(
      (_, i) => i !== index
    );

    updatedVariants[currentVariant] = {
      ...updatedVariants[currentVariant],
      images: updatedImages,
      mainImage:
        updatedVariants[currentVariant].mainImage ===
        updatedVariants[currentVariant].images[index]
          ? updatedImages[0] || null
          : updatedVariants[currentVariant].mainImage,
    };

    const updatedPreviews = [...imagePreviews];
    updatedPreviews[currentVariant] = updatedPreviews[currentVariant].filter(
      (_, i) => i !== index
    );

    setVariants(updatedVariants);
    setImagePreviews(updatedPreviews);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        sku: "",
        title: "",
        color: "",
        size: "",
        price: "",
        dimensions: "",
        images: [],
        mainImage: null,
      },
    ]);
    setImagePreviews([...imagePreviews, []]);
    setCurrentVariant(variants.length);
  };

  const handleSubmit = () => {
    if (!variants[currentVariant].sku) {
      alert("Missing SKU");
      return;
    }

    // Submit all variants
    variants.forEach((variant) => {
      if (variant.sku) {
        onSubmit(variant);
      }
    });

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>
            Add Product Variant {currentVariant + 1}/{variants.length}
          </span>
          <IconButton color="primary" onClick={addVariant}>
            <AddIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>SKU</InputLabel>
                  <Select
                    value={variants[currentVariant].sku}
                    onChange={handleSkuSelect}
                    label="SKU"
                  >
                    {skuOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  name="title"
                  fullWidth
                  value={variants[currentVariant].title}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Color"
                  name="color"
                  fullWidth
                  value={variants[currentVariant].color}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Size"
                  name="size"
                  fullWidth
                  value={variants[currentVariant].size}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Price"
                  name="price"
                  type="number"
                  fullWidth
                  value={variants[currentVariant].price}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Dimensions"
                  name="dimensions"
                  fullWidth
                  value={variants[currentVariant].dimensions}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <div
                className="image-placeholder"
                style={{
                  height: "150px",
                  border: "1px dashed #ccc",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                {variants[currentVariant].mainImage ? (
                  <img
                    src={URL.createObjectURL(
                      variants[currentVariant].mainImage
                    )}
                    alt="Main Preview"
                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                  />
                ) : (
                  <p>Main Image Preview</p>
                )}
              </div>

              <div
                className="drop-zone"
                style={{
                  border: "1px dashed #ccc",
                  padding: "10px",
                  textAlign: "center",
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const files = Array.from(e.dataTransfer.files);
                  handleImageUpload({ target: { files } });
                }}
              >
                <input
                  type="file"
                  multiple
                  accept="image/jpeg, image/png, image/webp"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                  id="variantFileInput"
                />
                <label htmlFor="variantFileInput" style={{ cursor: "pointer" }}>
                  Drop images here, or click to browse
                </label>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() =>
                    document.getElementById("variantFileInput").click()
                  }
                  sx={{ mt: 1 }}
                >
                  Upload Images
                </Button>
              </div>

              <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {imagePreviews[currentVariant]?.map((preview, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: "relative",
                      width: "60px",
                      height: "60px",
                      border:
                        variants[currentVariant].mainImage ===
                        variants[currentVariant].images[index]
                          ? "2px solid blue"
                          : "1px solid #ddd",
                    }}
                  >
                    <img
                      src={preview}
                      alt={`Thumbnail ${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onClick={() => handleSetMainImage(index)}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: -10,
                        right: -10,
                        backgroundColor: "white",
                        border: "1px solid #ddd",
                        padding: "2px",
                      }}
                      onClick={() => handleRemoveImage(index)}
                    >
                      ✖
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>

        {variants.length > 1 && (
          <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
            {variants.map((_, index) => (
              <Button
                key={index}
                variant={currentVariant === index ? "contained" : "outlined"}
                size="small"
                onClick={() => setCurrentVariant(index)}
                sx={{ mx: 0.5 }}
              >
                {index + 1}
              </Button>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save Variants
        </Button>
      </DialogActions>
    </Dialog>
  );
}
