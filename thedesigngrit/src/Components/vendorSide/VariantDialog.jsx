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

// Define the sage green color
const sageGreen = "#6a8452";

export default function VariantDialog({ open, onClose, onSubmit, sku }) {
  const [variants, setVariants] = useState([
    {
      sku: sku || "",
      title: "",
      color: "",
      size: "",
      price: "",
      dimensions: {
        length: "",
        width: "",
        height: "",
        weight: "",
      },
      images: [],
      mainImage: null,
      productId: null,
    },
  ]);
  const [currentVariant, setCurrentVariant] = useState(0);
  const [imagePreviews, setImagePreviews] = useState([[]]);
  const [skuOptions, setSkuOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productId, setProductId] = useState(null);

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
          dimensions: {
            length: "",
            width: "",
            height: "",
            weight: "",
          },
          images: [],
          mainImage: null,
          productId: null,
        },
      ]);
      setCurrentVariant(0);
      setImagePreviews([[]]);
      setProductId(null);
    }
  }, [open, sku]);

  // Fetch product ID when SKU changes
  useEffect(() => {
    const currentSku = variants[currentVariant]?.sku;

    // Only fetch if we have a SKU and don't already have a productId for this variant
    if (currentSku && !variants[currentVariant].productId) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `https://api.thedesigngrit.com/api/product-variants/product-by-sku/${currentSku}`
          );

          if (response.data && response.data.productId) {
            // Update the productId in the current variant
            setVariants((prevVariants) => {
              // Make sure we're still on the same variant
              if (currentVariant >= prevVariants.length) return prevVariants;

              // Only update if the SKU hasn't changed
              if (prevVariants[currentVariant].sku !== currentSku)
                return prevVariants;

              const updatedVariants = [...prevVariants];
              updatedVariants[currentVariant] = {
                ...updatedVariants[currentVariant],
                productId: response.data.productId,
              };
              return updatedVariants;
            });

            // Also store the productId at the component level
            setProductId(response.data.productId);

            console.log(
              `Product ID for SKU ${currentSku}: ${response.data.productId}`
            );
          } else {
            console.warn(`No product ID found for SKU: ${currentSku}`);
          }
        } catch (err) {
          console.error(
            `Error fetching product ID for SKU ${currentSku}:`,
            err
          );
        }
      };

      fetchData();
    }
  }, [currentVariant, variants[currentVariant]?.sku]);

  const fetchSkus = async () => {
    try {
      const response = await axios.get(
        "https://api.thedesigngrit.com/api/product-variants/skus"
      );
      // Extract just the SKU strings from the response if it's an array of objects
      if (
        Array.isArray(response.data) &&
        response.data.length > 0 &&
        typeof response.data[0] === "object"
      ) {
        // If the response contains objects with a 'sku' property
        const skuStrings = response.data.map((item) => item.sku);
        setSkuOptions(skuStrings);
      } else {
        // If the response is already an array of strings or another format
        setSkuOptions(response.data);
      }
    } catch (err) {
      console.error("Error fetching SKUs:", err);
    }
  };

  // Update handleChange to handle nested dimensions
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedVariants = [...variants];

    // Check if this is a dimensions field
    if (name.startsWith("dimensions.")) {
      const dimensionField = name.split(".")[1]; // Get the specific dimension field (length, width, etc.)
      updatedVariants[currentVariant] = {
        ...updatedVariants[currentVariant],
        dimensions: {
          ...updatedVariants[currentVariant].dimensions,
          [dimensionField]: value,
        },
      };
    } else {
      // Handle regular fields
      updatedVariants[currentVariant] = {
        ...updatedVariants[currentVariant],
        [name]: value,
      };
    }

    setVariants(updatedVariants);
  };

  const handleSkuSelect = (e) => {
    const { value } = e.target;

    // Only update if the SKU has actually changed
    if (variants[currentVariant].sku !== value) {
      const updatedVariants = [...variants];
      updatedVariants[currentVariant] = {
        ...updatedVariants[currentVariant],
        sku: value,
        productId: null, // Reset productId when SKU changes
      };
      setVariants(updatedVariants);

      // Reset the component-level productId if we're changing the first variant's SKU
      if (currentVariant === 0) {
        setProductId(null);
      }
    }
  };

  // Handle array fields (colors, sizes)
  const handleArrayChange = (e, field) => {
    const { value } = e.target;

    // Split the input value by commas and trim each item
    const arrayValues = value.split(",").map((item) => item.trim());

    const updatedVariants = [...variants];
    updatedVariants[currentVariant] = {
      ...updatedVariants[currentVariant],
      [field]: arrayValues,
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
        dimensions: {
          length: "",
          width: "",
          height: "",
          weight: "",
        },
        images: [],
        mainImage: null,
      },
    ]);
    setImagePreviews([...imagePreviews, []]);
    setCurrentVariant(variants.length);
  };

  const handleSubmit = async () => {
    if (!variants[currentVariant].sku) {
      alert("Missing SKU");
      return;
    }

    if (!productId) {
      alert(
        "Product ID is required to create variants. Please select a valid SKU."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for all variants
      const formData = new FormData();

      // Prepare variants data with imageIndices to map uploaded images to variants
      const variantsData = [];
      let currentImageIndex = 0;

      variants.forEach((variant) => {
        if (variant.sku) {
          // Calculate image indices for this variant
          const imageCount = variant.images.length;
          const imageIndices = Array.from(
            { length: imageCount },
            (_, i) => currentImageIndex + i
          );

          // Add variant data with image indices
          variantsData.push({
            sku: variant.sku,
            title: variant.title || "",
            color: variant.color || "",
            size: variant.size || "",
            price: variant.price || "",
            dimensions: JSON.stringify(variant.dimensions), // Convert dimensions object to string
            imageIndices: imageIndices,
            mainImageIndex: variant.mainImage
              ? currentImageIndex + variant.images.indexOf(variant.mainImage)
              : null,
          });

          // Update current image index for next variant
          currentImageIndex += imageCount;
        }
      });

      // Append variants as JSON string
      formData.append("variants", JSON.stringify(variantsData));

      // Append all images from all variants
      variants.forEach((variant) => {
        if (variant.sku) {
          variant.images.forEach((image) => {
            formData.append("images", image);
          });
        }
      });

      // Submit to the API with productId in the URL
      const response = await axios.post(
        `https://api.thedesigngrit.com/api/product/${productId}/variants`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Variants created successfully:", response.data);

      // Show success message
      alert("All variants saved successfully!");

      // Call the onSubmit callback if provided
      if (typeof onSubmit === "function") {
        onSubmit(response.data.variants);
      }

      // Close the dialog
      onClose();
    } catch (error) {
      console.error("Error creating variants:", error);
      alert(
        `Failed to save variants: ${
          error.response?.data?.error || error.message
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>
            Add Product Variant {currentVariant + 1}/{variants.length}
          </span>
          <IconButton
            color="primary"
            onClick={addVariant}
            sx={{
              backgroundColor: sageGreen,
              color: "white",
              "&:hover": {
                backgroundColor: "#5a7342",
              },
            }}
          >
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
                    name="sku"
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
              <Grid item xs={12}>
                <TextField
                  label="Colors (comma separated)"
                  name="color"
                  fullWidth
                  value={variants[currentVariant].color}
                  onChange={handleChange}
                  placeholder="Ex: Red, Blue, Green"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Sizes (comma separated)"
                  name="size"
                  fullWidth
                  value={variants[currentVariant].size}
                  onChange={handleChange}
                  placeholder="Ex: Small, Medium, Large"
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
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            {/* Technical Dimensions */}
            <Box sx={{ mb: 2 }}>
              <h3>Technical Dimensions</h3>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Length (CM)"
                    name="dimensions.length"
                    type="number"
                    fullWidth
                    value={variants[currentVariant].dimensions.length}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Width (CM)"
                    name="dimensions.width"
                    type="number"
                    fullWidth
                    value={variants[currentVariant].dimensions.width}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Height (CM)"
                    name="dimensions.height"
                    type="number"
                    fullWidth
                    value={variants[currentVariant].dimensions.height}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Weight (Kg)"
                    name="dimensions.weight"
                    type="number"
                    fullWidth
                    value={variants[currentVariant].dimensions.weight}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Image Upload Section */}
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
              </div>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Variants"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
