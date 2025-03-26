import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Switch,
  FormControlLabel,
  Grid,
  Typography,
  Divider,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

const initialVariant = {
  name: "",
  color: "",
  material: "",
  size: "",
  price: "",
  leadTime: "",
  image: null,
  sku: "", // Will be auto-generated
  stock: "",
  dimensions: {
    length: "",
    width: "",
    height: "",
    weight: "",
  },
  technicalSpecs: [{ key: "", value: "" }],
  status: true,
};

const VariantDialog = ({ open, onClose, onSave, productName }) => {
  const [variants, setVariants] = useState([{ ...initialVariant }]);

  const generateSKU = (variant, index) => {
    // Generate SKU based on product name and variant details
    const baseString = `${productName}-${variant.color}-${variant.size}-${
      index + 1
    }`.toUpperCase();
    return baseString.replace(/\s+/g, "-");
  };

  const handleAddVariant = () => {
    setVariants([...variants, { ...initialVariant }]);
  };

  const handleRemoveVariant = (index) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      newVariants[index][parent][child] = value;
    } else {
      newVariants[index][field] = value;
    }
    // Auto-generate SKU when certain fields change
    if (["name", "color", "size"].includes(field)) {
      newVariants[index].sku = generateSKU(newVariants[index], index);
    }
    setVariants(newVariants);
  };

  const handleAddTechSpec = (variantIndex) => {
    const newVariants = [...variants];
    newVariants[variantIndex].technicalSpecs.push({ key: "", value: "" });
    setVariants(newVariants);
  };

  const handleRemoveTechSpec = (variantIndex, specIndex) => {
    const newVariants = [...variants];
    newVariants[variantIndex].technicalSpecs = newVariants[
      variantIndex
    ].technicalSpecs.filter((_, i) => i !== specIndex);
    setVariants(newVariants);
  };

  const handleTechSpecChange = (variantIndex, specIndex, field, value) => {
    const newVariants = [...variants];
    newVariants[variantIndex].technicalSpecs[specIndex][field] = value;
    setVariants(newVariants);
  };

  const handleImageChange = (variantIndex, event) => {
    const file = event.target.files[0];
    if (file) {
      const newVariants = [...variants];
      newVariants[variantIndex].image = file;
      setVariants(newVariants);
    }
  };

  const handleSave = () => {
    // Validate variants before saving
    const validVariants = variants.filter(
      (variant) => variant.name && variant.price && variant.stock
    );
    onSave(validVariants);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Product Variants</Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddVariant}
            variant="contained"
            color="primary"
          >
            Add Variant
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        {variants.map((variant, variantIndex) => (
          <Box key={variantIndex} mb={4}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">Variant {variantIndex + 1}</Typography>
              {variants.length > 1 && (
                <IconButton
                  onClick={() => handleRemoveVariant(variantIndex)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={variant.name}
                  onChange={(e) =>
                    handleVariantChange(variantIndex, "name", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Color"
                  value={variant.color}
                  onChange={(e) =>
                    handleVariantChange(variantIndex, "color", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Material"
                  value={variant.material}
                  onChange={(e) =>
                    handleVariantChange(
                      variantIndex,
                      "material",
                      e.target.value
                    )
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Size"
                  value={variant.size}
                  onChange={(e) =>
                    handleVariantChange(variantIndex, "size", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  value={variant.price}
                  onChange={(e) =>
                    handleVariantChange(variantIndex, "price", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Lead Time"
                  value={variant.leadTime}
                  onChange={(e) =>
                    handleVariantChange(
                      variantIndex,
                      "leadTime",
                      e.target.value
                    )
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Stock"
                  type="number"
                  value={variant.stock}
                  onChange={(e) =>
                    handleVariantChange(variantIndex, "stock", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="SKU"
                  value={variant.sku}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  type="file"
                  id={`variant-image-${variantIndex}`}
                  style={{ display: "none" }}
                  onChange={(e) => handleImageChange(variantIndex, e)}
                />
                <label htmlFor={`variant-image-${variantIndex}`}>
                  <Button variant="outlined" component="span" fullWidth>
                    {variant.image ? variant.image.name : "Upload Image"}
                  </Button>
                </label>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1">Dimensions</Typography>
                <Grid container spacing={2}>
                  {["length", "width", "height", "weight"].map((dim) => (
                    <Grid item xs={3} key={dim}>
                      <TextField
                        fullWidth
                        label={dim.charAt(0).toUpperCase() + dim.slice(1)}
                        type="number"
                        value={variant.dimensions[dim]}
                        onChange={(e) =>
                          handleVariantChange(
                            variantIndex,
                            `dimensions.${dim}`,
                            e.target.value
                          )
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="subtitle1">
                    Technical Specifications
                  </Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => handleAddTechSpec(variantIndex)}
                    size="small"
                  >
                    Add Spec
                  </Button>
                </Box>
                {variant.technicalSpecs.map((spec, specIndex) => (
                  <Box key={specIndex} display="flex" gap={2} mt={1}>
                    <TextField
                      label="Key"
                      value={spec.key}
                      onChange={(e) =>
                        handleTechSpecChange(
                          variantIndex,
                          specIndex,
                          "key",
                          e.target.value
                        )
                      }
                    />
                    <TextField
                      label="Value"
                      value={spec.value}
                      onChange={(e) =>
                        handleTechSpecChange(
                          variantIndex,
                          specIndex,
                          "value",
                          e.target.value
                        )
                      }
                    />
                    <IconButton
                      onClick={() =>
                        handleRemoveTechSpec(variantIndex, specIndex)
                      }
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={variant.status}
                      onChange={(e) =>
                        handleVariantChange(
                          variantIndex,
                          "status",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Enable Variant"
                />
              </Grid>
            </Grid>
            {variantIndex < variants.length - 1 && <Divider sx={{ my: 2 }} />}
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save Variants
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VariantDialog;
