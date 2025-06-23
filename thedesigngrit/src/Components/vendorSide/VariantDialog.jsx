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
import Cropper from "react-easy-crop";
import CircularProgress from "@mui/material/CircularProgress";
// Define the sage green color
const sageGreen = "#6a8452";

export default function VariantDialog({
  open,
  onClose,
  onSubmit,
  sku,
  brandId,
}) {
  const [variants, setVariants] = useState([
    {
      sku: sku || "",
      title: "",
      color: "",
      size: "",
      price: "",
      stock: "", // Add stock field
      dimensions: {
        length: "",
        width: "",
        height: "",
        weight: "", // Add weight field
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

  // Add state for product colors and sizes
  const [productColors, setProductColors] = useState([]);
  const [productSizes, setProductSizes] = useState([]);

  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState(null);
  const [pendingFiles, setPendingFiles] = useState([]); // queue of files to crop
  const [pendingFileIndex, setPendingFileIndex] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

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
          stock: "", // Add stock field
          dimensions: {
            length: "",
            width: "",
            height: "",
            weight: "", // Add weight field
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

  // Modify useEffect to fetch product colors and sizes when productId is set
  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const fetchSkus = async () => {
    try {
      const response = await axios.get(
        `https://api.thedesigngrit.com/api/products/getproducts/brand/${brandId}`
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

  // Add function to fetch product details
  const fetchProductDetails = async () => {
    try {
      console.log("Fetching product details for productId:", productId);
      const response = await axios.get(
        `https://api.thedesigngrit.com/api/products/getsingle/${productId}`
      );
      if (response.data) {
        console.log("Product details received:", response.data);
        console.log("Colors:", response.data.colors);
        console.log("Sizes:", response.data.sizes);

        setProductColors(response.data.colors || []);
        setProductSizes(response.data.sizes || []);
      }
    } catch (err) {
      console.error("Error fetching product details:", err);
    }
  };

  // Add useEffect to log when colors and sizes change
  useEffect(() => {
    console.log("Product colors updated:", productColors);
  }, [productColors]);

  useEffect(() => {
    console.log("Product sizes updated:", productSizes);
  }, [productSizes]);

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
  const getCroppedImg = (imageSrc, croppedAreaPixels) => {
    return new Promise((resolve) => {
      const image = new window.Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );
        canvas.toBlob((blob) => resolve(blob), "image/jpeg");
      };
    });
  };
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setPendingFiles(files);
    setPendingFileIndex(0);
    setSelectedImageSrc(URL.createObjectURL(files[0]));
    setShowCropModal(true);
  };

  const handleSetMainImage = (index) => {
    if (index < 0 || !variants[currentVariant].images[index]) return;

    const updatedVariants = [...variants];
    updatedVariants[currentVariant] = {
      ...updatedVariants[currentVariant],
      mainImage: updatedVariants[currentVariant].images[index],
    };
    setVariants(updatedVariants);

    console.log("Set main image to index:", index);
  };

  const handleRemoveImage = (index) => {
    if (index < 0 || !variants[currentVariant].images[index]) return;

    const updatedVariants = [...variants];
    const updatedImages = updatedVariants[currentVariant].images.filter(
      (_, i) => i !== index
    );

    // Check if we're removing the main image
    const isRemovingMainImage =
      updatedVariants[currentVariant].mainImage ===
      updatedVariants[currentVariant].images[index];

    updatedVariants[currentVariant] = {
      ...updatedVariants[currentVariant],
      images: updatedImages,
      mainImage: isRemovingMainImage
        ? updatedImages[0] || null
        : updatedVariants[currentVariant].mainImage,
    };

    const updatedPreviews = [...imagePreviews];
    updatedPreviews[currentVariant] = updatedPreviews[currentVariant].filter(
      (_, i) => i !== index
    );

    setVariants(updatedVariants);
    setImagePreviews(updatedPreviews);

    console.log("Removed image at index:", index);
    console.log("Remaining images:", updatedImages.length);
  };
  const handleCropComplete = async () => {
    const file = pendingFiles[pendingFileIndex];
    const blob = await getCroppedImg(selectedImageSrc, croppedAreaPixels);
    const croppedFile = new File([blob], file.name, { type: "image/jpeg" });
    const previewUrl = URL.createObjectURL(blob);

    // Add to images and previews for the current variant
    const updatedVariants = [...variants];
    updatedVariants[currentVariant].images = [
      ...updatedVariants[currentVariant].images,
      croppedFile,
    ];
    if (!updatedVariants[currentVariant].mainImage) {
      updatedVariants[currentVariant].mainImage = croppedFile;
    }

    const updatedPreviews = [...imagePreviews];
    if (!updatedPreviews[currentVariant]) updatedPreviews[currentVariant] = [];
    updatedPreviews[currentVariant] = [
      ...updatedPreviews[currentVariant],
      previewUrl,
    ];

    setVariants(updatedVariants);
    setImagePreviews(updatedPreviews);

    // Move to next file or close modal
    if (pendingFileIndex + 1 < pendingFiles.length) {
      setPendingFileIndex(pendingFileIndex + 1);
      setSelectedImageSrc(
        URL.createObjectURL(pendingFiles[pendingFileIndex + 1])
      );
    } else {
      setShowCropModal(false);
      setPendingFiles([]);
      setPendingFileIndex(0);
      setSelectedImageSrc(null);
    }
  };
  // Modify addVariant to use same SKU and productId as first variant
  const addVariant = () => {
    const firstVariant = variants[0];
    setVariants([
      ...variants,
      {
        sku: firstVariant.sku,
        title: "",
        color: "",
        size: "",
        price: "",
        stock: "", // Add stock field
        dimensions: {
          length: "",
          width: "",
          height: "",
          weight: "", // Add weight field
        },
        images: [],
        mainImage: null,
        productId: firstVariant.productId,
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
            color: variant.color || "", // Now a single color from dropdown
            size: variant.size || "", // Now a single size from dropdown
            price: variant.price || "",
            stock: variant.stock || 0, // Add stock to the API submission
            dimensions: JSON.stringify({
              length: variant.dimensions.length || 0,
              width: variant.dimensions.width || 0,
              height: variant.dimensions.height || 0,
              weight: variant.dimensions.weight || 0, // Add weight to the JSON string
            }),
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
        `https://api.thedesigngrit.com/api/product-variants/product/${productId}/variants`,
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
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
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
                  <FormControl fullWidth>
                    <InputLabel>Color</InputLabel>
                    <Select
                      value={variants[currentVariant].color}
                      onChange={handleChange}
                      label="Color"
                      name="color"
                    >
                      {productColors && productColors.length > 0 ? (
                        productColors.map((color) => (
                          <MenuItem key={color} value={color}>
                            {color}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="" disabled>
                          No colors available
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Size</InputLabel>
                    <Select
                      value={variants[currentVariant].size}
                      onChange={handleChange}
                      label="Size"
                      name="size"
                    >
                      {productSizes && productSizes.length > 0 ? (
                        productSizes.map((size) => (
                          <MenuItem key={size} value={size}>
                            {size}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="" disabled>
                          No sizes available
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
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
                    label="Stock"
                    name="stock"
                    type="number"
                    fullWidth
                    value={variants[currentVariant].stock}
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
                      label="Weight (KG)"
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
                  <label
                    htmlFor="variantFileInput"
                    style={{ cursor: "pointer" }}
                  >
                    Drop images here, or click to browse
                  </label>
                </div>

                {/* Image Thumbnails for Selection */}
                <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {imagePreviews[currentVariant] &&
                    imagePreviews[currentVariant].map((preview, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: "relative",
                          width: "80px",
                          height: "80px",
                          border:
                            variants[currentVariant].mainImage ===
                            variants[currentVariant].images[index]
                              ? "2px solid #6a8452"
                              : "1px solid #ccc",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={preview}
                          alt={`Thumbnail ${index}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSetMainImage(index)}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: "absolute",
                            top: "2px",
                            right: "2px",
                            backgroundColor: "rgba(255,255,255,0.7)",
                            padding: "2px",
                            "&:hover": { backgroundColor: "rgba(255,0,0,0.2)" },
                          }}
                          onClick={() => handleRemoveImage(index)}
                        >
                          ✕
                        </IconButton>
                        {variants[currentVariant].mainImage ===
                          variants[currentVariant].images[index] && (
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: "2px",
                              left: "2px",
                              backgroundColor: "rgba(106,132,82,0.7)",
                              color: "white",
                              fontSize: "10px",
                              padding: "2px 4px",
                              borderRadius: "2px",
                            }}
                          >
                            Main
                          </Box>
                        )}
                      </Box>
                    ))}
                </Box>
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
      {showCropModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur (5px)",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              maxWidth: 500,
              width: "90vw",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ width: 400, height: 300, position: "relative" }}>
              <Cropper
                image={selectedImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, area) => setCroppedAreaPixels(area)}
              />
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCropComplete}
              >
                Crop Image
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setShowCropModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
